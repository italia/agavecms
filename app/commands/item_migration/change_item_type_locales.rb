module ItemMigration
  class ChangeItemTypeLocales
    attr_reader :item_type
    attr_reader :locales_to_add, :locales_to_keep, :locales_to_remove

    def initialize(
      item_type,
      locales_to_add,
      locales_to_keep,
      locales_to_remove
    )
      @item_type = item_type
      @locales_to_add = locales_to_add
      @locales_to_keep = locales_to_keep
      @locales_to_remove = locales_to_remove
    end

    def call
      if locales_to_remove.any?
        item_upload_ids = items.select(select_operation.to_sql).
                          map(&:build_array).flatten.compact

        if item_upload_ids.any?
          ItemUpload.where(id: item_upload_ids).delete_all
        end
      end

      items.update_all(update_operation.to_sql)
      ItemMigration::Validate.new(item_type).call
    end

    private

    def select_operation
      Arel::Nodes::NamedFunction.new(
        "json_build_array",
        item_upload_ids_to_destroy,
        "build_array"
      )
    end

    def items
      item_type.items
    end

    def update_operation
      Arel::Nodes::InfixOperation.new(
        "=",
        Arel.sql("data"),
        Arel::Nodes::NamedFunction.new("jsonb_build_object", key_values)
      )
    end

    def key_values
      result = []

      fields.each do |field|
        value = if field.localized
                  localized_value(field)
                else
                  non_localized_value(field)
                end

        result.push([
          Arel.sql(Item.connection.quote(field.id.to_s)),
          value
        ])
      end

      result.flatten
    end

    def non_localized_value(field)
      Arel::Nodes::NamedFunction.new(
        "jsonb_extract_path", [
          Arel.sql("data"),
          Arel.sql(Item.connection.quote(field.id.to_s))
        ]
      )
    end

    def localized_value(field)
      result = []
      locales_to_add.each do |locale|
        result.push([
          Arel.sql(Item.connection.quote(locale)),
          Arel.sql("NULL")
        ])
      end

      locales_to_keep.each do |locale|
        result.push([
          Arel.sql(Item.connection.quote(locale)),
          field_locale_value(field, locale)
        ])
      end

      Arel::Nodes::NamedFunction.new(
        "jsonb_build_object", result.flatten
      )
    end

    def item_upload_ids_to_destroy
      ids = []
      fields.each do |field|
        if
          field.localized &&
          Field::FIELD_TYPES_WITH_UPLOADS.include?(field.field_type)

          locales_to_remove.each do |locale|
            if field.field_type == "seo"
              sql_path = Arel::Nodes::NamedFunction.new(
                "jsonb_extract_path", [
                  Arel.sql("data"),
                  Arel.sql(Item.connection.quote(field.id.to_s)),
                  Arel.sql(Item.connection.quote(locale)),
                  Arel.sql(Item.connection.quote("image"))
                ]
              )
              ids << sql_path
            else
              ids << field_locale_value(field, locale)
            end
          end
        end
      end

      ids
    end

    def field_locale_value(field, locale)
      Arel::Nodes::NamedFunction.new(
        "jsonb_extract_path", [
          Arel.sql("data"),
          Arel.sql(Item.connection.quote(field.id.to_s)),
          Arel.sql(Item.connection.quote(locale))
        ]
      )
    end

    def fields
      @fields ||= item_type.fields.to_a
    end
  end
end
