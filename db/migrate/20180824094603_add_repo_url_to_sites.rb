class AddRepoUrlToSites < ActiveRecord::Migration[5.2]
  def change
    add_column :sites, :git_repo_url, :string
  end
end
