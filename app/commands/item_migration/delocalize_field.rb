module ItemMigration
  class DelocalizeField
    attr_reader :field

    def initialize(field)
      @field = field
    end

    def call
      ActiveRecord::Base.transaction do
        items.update_all(update_operation.to_sql)

        ItemUpload.
          joins(:item).
          where(field: field, locale: site.main_locale).
          update_all(locale: nil)

        ItemUpload.
          joins(:item).
          where(field: field, locale: site.locales - [site.main_locale]).
          delete_all
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
            new_value,
            Arel.sql("true")
          ]
        )
      )
    end

    def new_value
      Arel::Nodes::NamedFunction.new(
        "jsonb_extract_path", [
          Arel.sql("data"),
          Arel.sql(Item.connection.quote(field.id.to_s)),
          Arel.sql(Item.connection.quote(site.main_locale))
        ]
      )
    end

    def site
      field.item_type.site
    end
  end
end
