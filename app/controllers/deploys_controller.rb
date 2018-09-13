class DeploysController < BaseController
  def create
    deploy_event = DeployEvent.create!(
      site: Site.first,
      event_type: DeployEvent::REQUEST,
      environment: Rails.env,
      data: {}
    )

    DeployJob.perform_later(deploy_event.id)
  end
end
