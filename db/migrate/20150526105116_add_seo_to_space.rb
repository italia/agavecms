class AddSeoToSpace < ActiveRecord::Migration[5.2]
  def change
    add_column :spaces, :global_seo, :json
    add_column :spaces, :no_index, :bool, default: false
  end
end
