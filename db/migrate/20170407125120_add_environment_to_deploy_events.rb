class AddEnvironmentToDeployEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :deploy_events, :environment, :string,
      null: false, default: "production"

    change_column_default :deploy_events, :environment, nil
  end
end
