module ItemMigration
  class LocalizeField
    attr_reader :field

    def initialize(field)
      @field = field
    end

    def call
      ActiveRecord::Base.transaction do
        items.update_all(update_operation.to_sql)

        ItemUpload.
          joins(:item).
          where(field: field).
          update_all(locale: site.main_locale)
      end
    end

    private

    def items
      field.item_type.items
    end

    def update_operation
      Arel::Nodes::InfixOperation.new(
        "=",
        Arel.sql("data"),
        Arel::Nodes::NamedFunction.new(
          "jsonb_set", [
            Arel.sql("data"),
            Arel.sql(Item.connection.quote("{#{field.id}}")),
            Arel::Nodes::NamedFunction.new("jsonb_build_object", new_value),
            Arel.sql("true")
          ]
        )
      )
    end

    def new_value
      site.locales.map do |locale|
        if locale == site.main_locale
          [
            Arel.sql(Item.connection.quote(locale)),
            Arel::Nodes::NamedFunction.new(
              "jsonb_extract_path", [
                Arel.sql("data"),
                Arel.sql(Item.connection.quote(field.id.to_s))
              ]
            )
          ]
        else
          [
            Arel.sql(Item.connection.quote(locale)),
            Arel.sql("NULL")
          ]
        end
      end.flatten
    end

    def site
      field.item_type.site
    end
  end
end
