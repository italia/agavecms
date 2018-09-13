class RemoveImageDataFromItems < ActiveRecord::Migration[5.2]
  def change
    remove_column :items, :image_data, :text
  end
end
