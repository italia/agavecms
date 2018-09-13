class RemoveAccount < ActiveRecord::Migration[5.2]
  def up
    remove_column :sites, :account_id
    drop_table :billing_profiles
    drop_table :accounts
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
