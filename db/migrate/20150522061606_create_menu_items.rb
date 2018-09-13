class CreateMenuItems < ActiveRecord::Migration[5.2]
  def change
    create_table :menu_items do |t|
      t.references :space, null: false, index: true, foreign_key: true
      t.integer :parent_id
      t.string :label, null: false
      t.references :content_type, index: true, foreign_key: true
      t.integer :position, default: 99, null: false
      t.timestamps null: false
    end

    add_index :menu_items, [:space_id, :label, :parent_id], unique: true
  end
end
