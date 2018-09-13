class AddCheckPolicyToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :check_policy, :boolean, null: false, default: false
  end
end
