class CreateRecords < ActiveRecord::Migration[5.2]
  def change
    create_table :records do |t|
      t.references :content_type, index: true, foreign_key: true, null: false
      t.jsonb :data, null: false
      t.timestamps null: false
    end
  end
end
