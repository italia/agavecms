class ConvertTokensToAccessTokens < ActiveRecord::Migration[5.2]
  def change
    Site.find_each do |site|
      site.access_tokens.create!(
        name: "Read-only API token",
        token: site.readonly_token,
        hardcoded_type: "readonly"
      )
      site.access_tokens.create!(
        name: "Full-access API token",
        token: site.readwrite_token,
        hardcoded_type: "admin"
      )
    end
    remove_column :sites, :readonly_token
    remove_column :sites, :readwrite_token
  end
end
