class ItemUploadsIds
  attr_reader :items, :item_type, :locales

  def initialize(items, item_type, locales)
    @items = items
    @item_type = item_type
    @locales = locales
  end

  def call
    return [] if interesting_fields.empty?

    ActiveRecord::Base.connection.execute(
      items.select(select_operation).to_sql
    ).to_a.map do |result|
      JSON.parse(result["build_array"])
    end.flatten.compact
  end

  private

  def fields
    @fields ||= item_type.fields.to_a
  end

  def select_operation
    Arel::Nodes::NamedFunction.new(
      "json_build_array",
      item_upload_ids,
      "build_array"
    )
  end

  def item_upload_ids
    ids = []

    interesting_fields.each do |field|
      if field.localized
        locales.each do |locale|
          if field.field_type == "seo"
            ids << seo_field_value(field, locale)
          else
            ids << field_value(field, locale)
          end
        end
      else
        if field.field_type == "seo"
          ids << seo_field_value(field)
        else
          ids << field_value(field)
        end
      end
    end
    ids
  end

  def interesting_fields
    @interesting_fields ||= fields.select do |field|
      Field::FIELD_TYPES_WITH_UPLOADS.include?(field.field_type)
    end
  end

  def seo_field_value(field, locale = nil)
    Arel::Nodes::NamedFunction.new(
      "jsonb_extract_path",
      [
        Arel.sql("data"),
        Arel.sql(Item.connection.quote(field.id.to_s)),
        locale && Arel.sql(Item.connection.quote(locale)),
        Arel.sql(Item.connection.quote("image"))
      ].compact
    )
  end

  def field_value(field, locale = nil)
    Arel::Nodes::NamedFunction.new(
      "jsonb_extract_path",
      [
        Arel.sql("data"),
        Arel.sql(Item.connection.quote(field.id.to_s)),
        locale && Arel.sql(Item.connection.quote(locale))
      ].compact
    )
  end
end
