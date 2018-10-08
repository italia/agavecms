class UpsertEnvironment
  attr_reader :site
  attr_reader :name
  attr_reader :git_repo_url
  attr_reader :frontend_url
  attr_reader :deploy_adapter
  attr_reader :deploy_settings
  attr_reader :attributes
  attr_reader :environment

  def initialize(site, environment, payload)
    @site = site
    @attributes = payload[:attributes]
    @environment = environment
  end

  def call
    params = attributes.slice(
      :name,
      :git_repo_url,
      :frontend_url,
      :deploy_adapter,
      :deploy_settings
    )

    ActiveRecord::Base.transaction do
      environment.update_attributes!(params.merge(site: site))
    end
  end
end
