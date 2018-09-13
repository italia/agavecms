module ItemMigration
  class AddField
    attr_reader :field

    def initialize(field)
      @field = field
    end

    def call
      items.update_all(update_operation.to_sql)
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
            Arel.sql(Item.connection.quote(default_value.to_json)),
            Arel.sql("true")
          ]
        )
      )
    end

    def default_value
      if field.localized
        field.item_type.site.locales.inject({}) do |memo, locale|
          memo.merge(locale => nil)
        end
      end
    end
  end
end
