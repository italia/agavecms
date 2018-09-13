class CreateFields < ActiveRecord::Migration[5.2]
  def change
    create_table :fields do |t|
      t.references :content_type, index: true, foreign_key: true, null: false
      t.string :label, null: false
      t.string :api_key, null: false
      t.string :hint
      t.string :field_type, null: false
      t.integer :position, default: 999
      t.timestamps null: false
    end

    add_index :fields, [:content_type_id, :api_key], unique: true
    add_index :fields, [:content_type_id, :label], unique: true
  end
end
