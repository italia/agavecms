class UsersController < BaseController
  before_action(only: %i(index show create destroy)) do
    authentication.role.can_manage_users or
      render_invalid_permissions_error!
  end

  before_action :ensure_payload_schema!,
    only: %i(create update reset_password)

  def index
    users = current_site.users
    render json: users
  end

  def me
    render json: current_user
  end

  def show
    user = current_site.users.find(params[:id])
    render json: user
  end

  def create
    user = InviteUser.new(current_site, payload).call
    render json: user, status: 201
  end

  def update
    user = current_site.users.find(params[:id])
    UpdateUser.new(
      current_site,
      user,
      payload,
      current_user,
      authentication.role
    ).call

    render json: user, status: 200
  end

  def destroy
    user = current_site.users.find(params[:id])
    DestroyUser.new(current_site, user, current_role, current_user).call
    render json: user, status: 200
  end

  def reset_password
    SendPasswordReset.new(current_site, payload).call
    head :no_content
  end
end
