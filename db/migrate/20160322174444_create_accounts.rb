class CreateAccounts < ActiveRecord::Migration[5.2]
  def change
    create_table :accounts do |t|
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :password_reset_token
      t.timestamps null: false
    end
    add_index :accounts, :email, unique: true
  end
end
