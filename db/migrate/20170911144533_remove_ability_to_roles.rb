class RemoveAbilityToRoles < ActiveRecord::Migration[5.2]
  def change
    remove_column :roles, :can_access_search_results, :boolean
  end
end
