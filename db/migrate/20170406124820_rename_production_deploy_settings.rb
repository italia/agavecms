class RenameProductionDeploySettings < ActiveRecord::Migration[5.2]
  def change
    rename_column :sites, :deploy_status, :production_deploy_status
    rename_column :sites, :webhook_token, :production_webhook_token
  end
end
