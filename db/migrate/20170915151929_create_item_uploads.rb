class CreateItemUploads < ActiveRecord::Migration[5.2]
  def change
    create_table :item_uploads do |t|
      t.references :field, foreign_key: true, null: false
      t.references :item, foreign_key: true, null: false
      t.string :locale
    end

    add_column :item_uploads, :upload_path, :string
    add_index :item_uploads, :upload_path
  end
end
