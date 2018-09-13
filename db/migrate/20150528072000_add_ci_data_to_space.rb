class AddCiDataToSpace < ActiveRecord::Migration[5.2]
  def change
    execute <<-SQL
      CREATE TYPE deploy_status
      AS ENUM ('unstarted', 'pending', 'fail', 'success');
    SQL

    add_column :spaces, :ci_project_id, :string
    add_column :spaces, :ci_project_token, :string
    add_column :spaces, :last_data_change_at, :datetime
    add_column :spaces, :deploy_status, :deploy_status,
      null: false, default: "unstarted"
  end
end
