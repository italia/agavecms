class CreateAccessTokens < ActiveRecord::Migration[5.2]
  def change
    create_table :access_tokens do |t|
      t.string :name, null: false
      t.references :site, index: true, foreign_key: true, null: false
      t.references :role, foreign_key: true
      t.string :hardcoded_type
      t.string :token, null: false
      t.timestamps null: false
    end

    add_index :access_tokens, :token, unique: true
    add_index :access_tokens, [:site_id, :name], unique: true
  end
end
