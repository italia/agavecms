module ItemMigration
  class Reorder
    attr_reader :item_type

    def initialize(item_type)
      @item_type = item_type
    end

    def call
      return false unless item_type.sortable || item_type.tree

      item_type.items.
        where("subquery.id = items.id").
        update_all(update_operation)

      true
    end

    private

    def update_operation
      [
        'parent_id = NULL, position = subquery.sort_order FROM (
           SELECT
             id,
             row_number() OVER (ORDER BY updated_at DESC) AS sort_order
           FROM items
           WHERE item_type_id = ?
        ) subquery',
        item_type.id
      ]
    end
  end
end
