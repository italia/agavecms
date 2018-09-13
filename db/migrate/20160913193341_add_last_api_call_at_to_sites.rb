class AddLastApiCallAtToSites < ActiveRecord::Migration[5.2]
  def change
    add_column :sites, :last_dump_at, :datetime
  end
end
