class AccessTokensController < BaseController
  before_action(only: %i(index show create destroy)) do
    authentication.role.can_manage_access_tokens or
      render_invalid_permissions_error!
  end

  before_action :ensure_payload_schema!,
    only: %i(create update)

  def index
    access_tokens = current_site.access_tokens
    render json: access_tokens
  end

  def show
    access_token = current_site.access_tokens.find(params[:id])
    render json: access_token
  end

  def create
    role_id = payload[:data][:relationships][:role][:data][:id]

    access_token = current_site.access_tokens.create!(
      name: payload_attributes[:name],
      role: current_site.roles.find(role_id),
      token: SecureRandom.hex(15)
    )

    render json: access_token, status: 201
  end

  def update
    role_id = payload[:data][:relationships][:role][:data][:id]

    access_token = current_site.access_tokens.find(params[:id])

    if access_token.hardcoded_type
      render_error ApiError.new("NON_EDITABLE_ACCESS_TOKEN"), status: 401
    else
      access_token.update_attributes!(
        name: payload_attributes[:name],
        role: current_site.roles.find(role_id)
      )

      render json: access_token
    end
  end

  def destroy
    access_token = current_site.access_tokens.find(params[:id])

    if access_token.hardcoded_type
      render_error ApiError.new("NON_EDITABLE_ACCESS_TOKEN"), status: 401
    else
      access_token.destroy!
      render json: access_token
    end
  end

  def regenerate_token
    access_token = current_site.access_tokens.find(params[:id])

    access_token.update_attributes!(
      token: SecureRandom.hex(15)
    )

    render json: access_token
  end
end
