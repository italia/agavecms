class ItemFullTextSearch
  attr_reader :scope, :item_type, :query

  def initialize(scope, item_type, query)
    @scope = scope
    @item_type = item_type
    @query = query
  end

  def call
    if searchable_keypaths.any?
      scope.
        select("items.*").
        select(rank).
        where(condition).
        order("rank DESC")
    else
      scope
    end
  end

  private

  def condition
    @condition ||= Arel::Nodes::InfixOperation.new("@@", tsvector, tsquery)
  end

  def rank
    @rank ||= Arel::Nodes::NamedFunction.new(
      "ts_rank_cd",
      [tsvector, tsquery],
      "rank"
    )
  end

  def tsvector
    @tsvector ||= fields.inject do |memo, field|
      Arel::Nodes::InfixOperation.new("||", memo, field)
    end
  end

  def fields
    @fields ||= searchable_keypaths.map do |keypath|
      keys = keypath.map do |key|
        Arel.sql(Item.connection.quote(key))
      end

      extract_path_text = Arel::Nodes::NamedFunction.new(
        "jsonb_extract_path_text",
        [Item.arel_table[:data]] + keys
      )

      coalesce = Arel::Nodes::NamedFunction.new(
        "coalesce",
        [
          extract_path_text,
          Arel.sql(Item.connection.quote(""))
        ]
      )

      Arel::Nodes::NamedFunction.new("to_tsvector", [coalesce])
    end
  end

  def searchable_keypaths
    result = []

    item_type.fields.map do |field|
      if field.localized?
        locales.each do |locale|
          result += field_searchable_keypaths(field, locale)
        end
      else
        result += field_searchable_keypaths(field)
      end
    end

    result
  end

  def field_searchable_keypaths(field, locale = nil)
    result = []

    field.agave_field_type.searchable_keys.each do |key|
      result << if key == "."
                  [field.id.to_s, locale].compact
                else
                  [field.id.to_s, locale, *key.split(".")].compact
                end
    end

    result
  end

  def locales
    item_type.site.locales
  end

  def tsquery
    normalized_query = query.
                       strip.
                       downcase.
                       gsub(/[^[:alnum:]\-\s]/, "").
                       tr("-", " ").
                       gsub(/\s+/, " ").
                       strip.
                       gsub(/[\s]/, ":* & ").
                       gsub(/(.)$/, '\\1:*')

    @tsquery ||= Arel::Nodes::NamedFunction.new(
      "to_tsquery",
      [Arel.sql(Item.connection.quote(normalized_query))]
    )
  end
end
