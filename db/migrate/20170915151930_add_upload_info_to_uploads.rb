class AddUploadInfoToUploads < ActiveRecord::Migration[5.2]
  def change
    add_column :uploads, :width, :integer
    add_column :uploads, :height, :integer
    add_column :uploads, :format, :string
    add_column :uploads, :alt, :string
    add_column :uploads, :title, :string
    add_column :uploads, :is_image, :boolean, default: false
  end
end
