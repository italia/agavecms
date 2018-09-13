class DeployEventsController < BaseController
  before_action do
    authentication.role.can_read_deploy_events or
      render_invalid_permissions_error!
  end

  def index
    events = current_site.deploy_events.by_date_reverse.limit(30)
    render json: events
  end

  def show
    deploy_event = current_site.deploy_events.find(params[:id])
    render json: deploy_event
  end
end
