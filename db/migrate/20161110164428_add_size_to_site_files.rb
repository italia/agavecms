class AddSizeToSiteFiles < ActiveRecord::Migration[5.2]
  def change
    execute <<-SQL
      DELETE FROM site_files WHERE 1 = 1
    SQL

    add_column :site_files, :size, :integer, null: false
    add_reference :site_files, :field, index: true, null: false
    add_foreign_key :site_files, :fields, on_delete: :cascade

    Site.all.each do |site|
      site.items.each do |item|
        print "."
        UpdateSiteFiles.new(item).call
      end
    end
  end
end
