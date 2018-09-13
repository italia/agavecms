class AddFrontendUrlToSites < ActiveRecord::Migration[5.2]
  def change
    add_column :sites, :frontend_url, :string
  end
end
