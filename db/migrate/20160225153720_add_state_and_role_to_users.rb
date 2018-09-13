class AddStateAndRoleToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :is_admin, :bool, null: false, default: false
    add_column :users, :invite_token, :string
    change_column :users, :password_digest, :string, null: true
  end
end
