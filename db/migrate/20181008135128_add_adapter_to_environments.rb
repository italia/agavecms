class AddAdapterToEnvironments < ActiveRecord::Migration[5.2]
  def change
    add_column :environments, :deploy_adapter, :string
  end
end
