class AddDeployStatusToEnvironments < ActiveRecord::Migration[5.2]
  def change
    add_column :environments, :deploy_status, :string
  end
end
