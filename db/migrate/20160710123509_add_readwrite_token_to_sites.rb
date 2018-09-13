class AddReadwriteTokenToSites < ActiveRecord::Migration[5.2]
  def up
    add_column :sites, :readwrite_token, :string
    Site.all.each do |site|
      site.update_attributes!(readwrite_token: SecureRandom.hex(25))
    end
    change_column :sites, :readwrite_token, :string, null: false
  end

  def down
    remove_column :sites, :readwrite_token, :string
  end
end
