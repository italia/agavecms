class RenameRecordsToItems < ActiveRecord::Migration[5.2]
  def change
    rename_table :records, :items
    rename_column :content_types, :singleton_record_id, :singleton_item_id
  end
end
