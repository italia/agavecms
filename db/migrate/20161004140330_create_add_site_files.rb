class CreateAddSiteFiles < ActiveRecord::Migration[5.2]
  def up
    create_table :site_files, id: false do |t|
      t.string :path, null: false

      t.references :site, index: true, foreign_key: true, null: false,
                          on_delete: :cascade

      t.timestamps null: false
    end

    execute %{ ALTER TABLE "site_files" ADD PRIMARY KEY ("path"); }
  end

  def down
    drop_table :site_files
  end
end
