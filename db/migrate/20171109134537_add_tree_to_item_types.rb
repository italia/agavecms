class AddTreeToItemTypes < ActiveRecord::Migration[5.2]
  def change
    add_column :item_types, :tree, :boolean, default: false, null: false
    add_column :items, :parent_id, :integer
    add_foreign_key :items, :items, column: :parent_id, on_delete: :nullify
  end
end
