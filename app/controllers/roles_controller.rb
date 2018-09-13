class RolesController < BaseController
  before_action do
    authentication.role.can_manage_users or
      render_invalid_permissions_error!
  end

  before_action :ensure_payload_schema!,
    only: %i(create update)

  def index
    roles = current_site.roles
    render json: roles
  end

  def show
    role = current_site.roles.find(params[:id])
    render json: role
  rescue ActiveRecord::RecordNotFound
    render_error ApiError.new("NOT_FOUND"), status: 404
  end

  def create
    role = current_site.roles.new
    UpsertRole.new(current_site, role, payload).call
    render json: role, status: 201

  rescue InvalidRecordError => e
    render_errors e.errors
  end

  def update
    role = current_site.roles.find(params[:id])
    UpsertRole.new(current_site, role, payload).call
    render json: role, status: 200

  rescue ActiveRecord::RecordNotFound
    render_error ApiError.new("NOT_FOUND"), status: 404
  rescue InvalidRecordError => e
    render_errors e.errors
  end

  def destroy
    role = current_site.roles.find(params[:id])
    role.destroy!

    render json: role, status: 200

  rescue ActiveRecord::DeleteRestrictionError
    render_error ApiError.new("REQUIRED"), status: 422
  rescue ActiveRecord::RecordNotFound
    render_error ApiError.new("NOT_FOUND"), status: 404
  end
end
