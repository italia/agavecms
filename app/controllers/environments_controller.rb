class EnvironmentsController < BaseController
  before_action(only: %i(index show)) do
    authentication.role.can_access_site or
      render_invalid_permissions_error!
  end

  before_action(only: %i(create update destroy)) do
    authentication.role.can_edit_schema or
      render_invalid_permissions_error!
  end

  before_action :ensure_payload_schema!,
    only: %i(create update)

  def index
    environments = current_site.environments
    render json: environments
  end

  def show
    environment = current_site.environments.find(params[:id])
    render json: environment
  end

  def create
    environment = Environment.new
    UpsertEnvironment.new(current_site, environment, payload[:data]).call
    render json: environment,
      status: 201
  end

  def update
    environment = current_site.environments.find(params[:id])
    UpsertEnvironment.new(current_site, environment, payload[:data]).call

    render json: environment, status: 200
  end

  def destroy
    environment = current_site.environments.find(params[:id])
    environment.destroy!

    render json: environment, status: 200
  end
end
