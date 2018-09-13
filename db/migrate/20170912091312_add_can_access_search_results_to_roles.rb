class AddCanAccessSearchResultsToRoles < ActiveRecord::Migration[5.2]
  def change
    add_column :roles, :can_perform_site_search, :boolean, null: false, default: false

    execute <<-SQL
      UPDATE roles SET can_perform_site_search = TRUE WHERE name = 'Admin'
    SQL
  end
end
