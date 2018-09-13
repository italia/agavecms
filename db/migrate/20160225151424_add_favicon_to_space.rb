class AddFaviconToSpace < ActiveRecord::Migration[5.2]
  def change
    add_column :spaces, :favicon, :json
  end
end
