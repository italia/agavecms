class AddAttachmentDataToUploads < ActiveRecord::Migration[5.2]
  def change
    add_column :uploads, :attachment_data, :text
  end
end
