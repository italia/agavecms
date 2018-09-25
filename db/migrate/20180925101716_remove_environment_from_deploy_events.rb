class RemoveEnvironmentFromDeployEvents < ActiveRecord::Migration[5.2]
  def change
    remove_column :deploy_events, :environment, :string
  end
end
