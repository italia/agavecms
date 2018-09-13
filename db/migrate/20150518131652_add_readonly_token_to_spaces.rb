class AddReadonlyTokenToSpaces < ActiveRecord::Migration[5.2]
  def change
    add_column :spaces, :readonly_token, :string, null: false
    add_index :spaces, :readonly_token, unique: true
  end
end
