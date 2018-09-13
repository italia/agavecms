class ItemFieldSearch
  attr_reader :scope, :field, :value, :locale

  def initialize(scope, field, value, locale = nil)
    @scope = scope
    @field = field
    @value = value
    @locale = locale

    if field.localized? && !locale
      raise "locale needed!"
    end
  end

  def call
    if keypath
      scope.where(condition)
    else
      scope.none
    end
  end

  private

  def condition
    Arel::Nodes::Equality.new(
      extract_value,
      Arel.sql(Item.connection.quote(value))
    )
  end

  def extract_value
    keys = keypath.map do |key|
      Arel.sql(Item.connection.quote(key))
    end

    extract_path_text = Arel::Nodes::NamedFunction.new(
      "jsonb_extract_path_text",
      [Item.arel_table[:data]] + keys
    )

    Arel::Nodes::NamedFunction.new(
      "coalesce",
      [
        extract_path_text,
        Arel.sql(Item.connection.quote(""))
      ]
    )
  end

  def keypath
    if field.localized?
      [field.id.to_s, locale]
    else
      [field.id.to_s]
    end
  end
end
