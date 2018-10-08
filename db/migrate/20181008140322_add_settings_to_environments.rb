class AddSettingsToEnvironments < ActiveRecord::Migration[5.2]
  def change
    add_column :environments, :deploy_settings, :json, default: {}
  end
end
