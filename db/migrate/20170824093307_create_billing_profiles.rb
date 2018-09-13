class CreateBillingProfiles < ActiveRecord::Migration[5.2]
  def change
    create_table :billing_profiles do |t|
      t.references :account, foreign_key: true, null: false
      t.string :chargebee_customer_id, null: false
      t.string :chargebee_monthly_recurring_id
      t.string :chargebee_yearly_recurring_id
      t.timestamps
    end

    add_index :billing_profiles, :chargebee_customer_id, unique: true
  end
end
