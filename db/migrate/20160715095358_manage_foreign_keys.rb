class ManageForeignKeys < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :menu_items, :sites
    remove_foreign_key :menu_items, :item_types
    remove_foreign_key :item_types, :sites
    remove_foreign_key :fields, :item_types
    remove_foreign_key :sites, :accounts
    remove_foreign_key :users, :sites
    remove_foreign_key :items, :item_types

    add_foreign_key :menu_items, :sites, on_delete: :cascade
    add_foreign_key :menu_items, :item_types, on_delete: :nullify
    add_foreign_key :item_types, :sites, on_delete: :cascade
    add_foreign_key :fields, :item_types, on_delete: :cascade
    add_foreign_key :sites, :accounts, on_delete: :cascade
    add_foreign_key :users, :sites, on_delete: :cascade
    add_foreign_key :items, :item_types, on_delete: :cascade
  end
end
