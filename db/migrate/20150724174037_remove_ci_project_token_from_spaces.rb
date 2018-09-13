class RemoveCiProjectTokenFromSpaces < ActiveRecord::Migration[5.2]
  def change
    remove_column :spaces, :ci_project_token, :string
  end
end
