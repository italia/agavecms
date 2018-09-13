class AddOrderingFieldToItemTypes < ActiveRecord::Migration[5.2]
  def change
    execute <<-SQL
      CREATE TYPE order_direction
      AS ENUM ('asc', 'desc');
    SQL

    add_column :item_types, :ordering_field_id, :integer
    add_column :item_types, :ordering_direction, :order_direction

    add_foreign_key :item_types, :fields,
      column: :ordering_field_id, on_delete: :cascade
  end
end
