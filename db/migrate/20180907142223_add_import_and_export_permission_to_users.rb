class AddImportAndExportPermissionToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :roles, :can_import_and_export, :boolean, null: false, default: false

    execute <<-SQL
      UPDATE roles SET can_import_and_export = TRUE WHERE name = 'Admin'
    SQL
  end
end
