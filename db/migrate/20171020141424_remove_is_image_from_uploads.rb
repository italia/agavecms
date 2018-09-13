class RemoveIsImageFromUploads < ActiveRecord::Migration[5.2]
  def change
    remove_column :uploads, :is_image
  end
end
