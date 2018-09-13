class AddWebhookTokenToSites < ActiveRecord::Migration[5.2]
  def up
    add_column :sites, :webhook_token, :string
    Site.all.each do |site|
      site.update_attributes!(webhook_token: SecureRandom.hex(10))
    end
    change_column :sites, :webhook_token, :string, null: false
  end

  def down
    remove_column :sites, :webhook_token, :string
  end
end
