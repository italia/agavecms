class CreateEnvironments < ActiveRecord::Migration[5.2]
  def change
    create_table :environments do |t|
      t.references :site, index: true, foreign_key: true, null: false
      t.string :git_repo_url
      t.string :frontend_url
      t.string :name

      t.timestamps
    end
  end
end
