class MoveFrontendUrl < ActiveRecord::Migration[5.2]
  def change
    rename_column :sites, :frontend_url, :production_frontend_url
  end
end
