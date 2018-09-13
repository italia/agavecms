class RemoveStuffFromUploads < ActiveRecord::Migration[5.2]
  def change
    remove_column :uploads, :field_id
    remove_column :uploads, :item_id
  end
end
