class Authenticator
  attr_reader :request

  ADMIN_ROLE = {
    can_read_deploy_events: true,
    can_access_site: true,
    can_edit_site: true,
    can_edit_favicon: true,
    can_edit_schema: true,
    can_manage_users: true,
    can_manage_access_tokens: true,
    can_perform_site_search: true,
    can_publish_to_production: true,
    can_dump_data: true,
    can_import_and_export: true,
    positive_rules: [{ item_type_id: nil, action: "all" }],
    negative_rules: []
  }

  READONLY_TOKEN_ROLE = {
    can_access_site: true,
    can_read_deploy_events: false,
    can_edit_favicon: true,
    can_edit_site: false,
    can_edit_schema: false,
    can_manage_access_tokens: false,
    can_perform_site_search: true,
    can_manage_users: false,
    can_publish_to_production: false,
    can_dump_data: false,
    can_import_and_export: false,
    positive_rules: [{ item_type_id: nil, action: "read" }],
    negative_rules: []
  }

  NON_LOGGED_ROLE = {
    can_access_site: false,
    can_read_deploy_events: false,
    can_edit_favicon: false,
    can_edit_site: false,
    can_edit_schema: false,
    can_manage_access_tokens: false,
    can_perform_site_search: false,
    can_manage_users: false,
    can_publish_to_production: false,
    can_dump_data: false,
    can_import_and_export: false,
    positive_rules: [],
    negative_rules: []
  }

  def initialize(request)
    @request = request
  end

  def authentication
    if user_session
      user_session_authentication
    elsif access_token
      access_token_authentication
    else
      nonlogged_authentication
    end
  end

  private

  def user_session_authentication
    user = user_session.user
    Authentication.new(
      current_site,
      user.role.to_value_object,
      user
    )
  end

  def access_token_authentication
    if access_token.role
      Authentication.new(
        access_token.site,
        access_token.role.to_value_object
      )
    elsif access_token.hardcoded_type == "readonly"
      Authentication.new(
        access_token.site,
        Role::Value.new(READONLY_TOKEN_ROLE)
      )
    elsif access_token.hardcoded_type == "admin"
      Authentication.new(
        access_token.site,
        Role::Value.new(ADMIN_ROLE)
      )
    end
  end

  def nonlogged_authentication
    Authentication.new(current_site, Role::Value.new(NON_LOGGED_ROLE))
  end

  def access_token
    @access_token ||= begin
      AccessToken.where(token: authorization_key).first
    end
  end

  def user_session
    @user_session ||= begin
      if authorization_key
        session = UserSession.from_access_token(authorization_key)
        if session && session.site == current_site
          session
        end
      end
    end
  end

  def current_site
    Site.first
  end

  def authorization_key
    @authorization_key ||= begin
      if request.headers["Authorization"].present?
        request.headers["Authorization"].split(" ").last
      else
        request.query_parameters[:auth_token].presence
      end
    end
  end
end
