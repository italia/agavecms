class BaseController < ApplicationController
  serialization_scope :authentication

  before_action :ensure_accept_header!
  before_action :ensure_content_type_header!
  before_action :ensure_current_site!

  after_action :update_last_dump_at!

  private

  def render_invalid_permissions_error!
    render_error ApiError.new("INSUFFICIENT_PERMISSIONS"), status: 401
  end

  def ensure_current_site!
    current_site or
      render_error ApiError.new("INVALID_SITE"), status: 401
  end

  def ensure_payload_schema!
    errors = LinkValidator.find_for_action(
      :site_api,
      controller_name,
      action_name
    ).validate_schema(payload)
    if errors.any?
      render_error ApiError.new("INVALID_FORMAT", messages: errors)
    end
  end

  def current_site
    authentication.site
  end

  def current_role
    authentication.role
  end

  def current_user
    authentication.user
  end

  def authentication
    @authentication ||= Authenticator.new(request).authentication
  end

  def update_last_dump_at!
    if request.headers["X-Reason"] == "dump"
      current_site.register_dump! { }
    end
  end
end
