class AbortDeploySite
  attr_reader :site, :env

  def initialize(site, env)
    @site = site
    @env = env
  end

  def call
    return unless site.send("#{env}_deploy_status") == Site::STATUS_PENDING

    ActiveRecord::Base.transaction do
      event = DeployEvent.create!(
        site: site,
        event_type: DeployEvent::REQUEST_ABORTED,
        environment: env
      )

      site.update_attributes!(
        :"#{env}_deploy_status" => Site::STATUS_FAIL
      )
    end
  end
end
