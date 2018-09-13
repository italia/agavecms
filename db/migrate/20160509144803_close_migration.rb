class CloseMigration < ActiveRecord::Migration[5.2]
  def change
    change_column :spaces, :account_id, :integer, null: false
    change_column :spaces, :timezone, :string, null: false
    remove_column :spaces, :ci_project_id, :string
    remove_column :spaces, :trigger_token, :string
  end
end
