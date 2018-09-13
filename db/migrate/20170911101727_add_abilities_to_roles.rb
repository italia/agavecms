class AddAbilitiesToRoles < ActiveRecord::Migration[5.2]
  def change
    add_column :roles, :can_manage_access_tokens, :boolean, null: false, default: false
    add_column :roles, :can_access_search_results, :boolean, null: false, default: false

    execute <<-SQL
      UPDATE roles SET can_manage_access_tokens = TRUE, can_access_search_results = TRUE WHERE name = 'Admin'
    SQL
  end
end
