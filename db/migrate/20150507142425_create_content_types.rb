class CreateContentTypes < ActiveRecord::Migration[5.2]
  def change
    create_table :content_types do |t|
      t.references :space, index: true, foreign_key: true, null: false
      t.string :name, null: false
      t.string :api_key, null: false
      t.integer :position, default: 999
      t.timestamps null: false
    end

    add_index :content_types, [:space_id, :api_key], unique: true
    add_index :content_types, [:space_id, :name], unique: true
  end
end
