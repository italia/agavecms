class AddUniqueIndex < ActiveRecord::Migration[5.2]
  def change
    add_index :sites, :readwrite_token, unique: true
    add_index :sites, :webhook_token, unique: true
  end
end
