class AddIsAdminToUsers < ActiveRecord::Migration[5.2]
  def change
    remove_column :users, :is_admin
  end
end
