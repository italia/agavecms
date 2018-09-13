class RenameSpaceToSite < ActiveRecord::Migration[5.2]
  def change
    add_column :spaces, :notes, :text
    rename_table :spaces, :sites
    rename_column :content_types, :space_id, :site_id
    rename_column :menu_items, :space_id, :site_id
    rename_column :users, :space_id, :site_id
  end
end
