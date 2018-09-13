module ItemMigration
  class RemoveField
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
        Arel::Nodes::InfixOperation.new(
          "-",
          Arel.sql("data"),
          Arel.sql(Item.connection.quote(field.id.to_s))
        )
      )
    end
  end
end
