class DeploysController < BaseController
  def create
    environment = Environment.find_by_id(params["data"]["id"])

    deploy_event = DeployEvent.create!(
      site: Site.first,
      event_type: DeployEvent::REQUEST,
      environment: environment,
      data: {}
    )

    environment.update_attribute(:deploy_status, "pending")

    DeployJob.perform_later(deploy_event.id)
  end
end
