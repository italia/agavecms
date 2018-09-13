class RenameContentTypesToItemTypes < ActiveRecord::Migration[5.2]
  def change
    rename_table :content_types, :item_types
    rename_column :items, :content_type_id, :item_type_id
    rename_column :menu_items, :content_type_id, :item_type_id
    rename_column :fields, :content_type_id, :item_type_id
  end
end
