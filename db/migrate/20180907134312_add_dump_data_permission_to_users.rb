class AddDumpDataPermissionToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :roles, :can_dump_data, :boolean, null: false, default: false

    execute <<-SQL
      UPDATE roles SET can_dump_data = TRUE WHERE name = 'Admin'
    SQL
  end
end
