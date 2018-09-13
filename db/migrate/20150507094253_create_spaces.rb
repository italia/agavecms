class CreateSpaces < ActiveRecord::Migration[5.2]
  def change
    create_table :spaces do |t|
      t.string :domain, null: false
      t.string :name, null: false
      t.timestamps null: false
    end
    add_index :spaces, :domain, unique: true
  end
end
