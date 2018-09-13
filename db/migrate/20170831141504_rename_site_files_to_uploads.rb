class RenameSiteFilesToUploads < ActiveRecord::Migration[5.2]
  def change
    rename_table :site_files, :uploads
  end
end
