class SigninOrCompleteRegistration
  attr_reader :site, :data

  def initialize(site, payload)
    @site = site
    @data = payload[:data].with_indifferent_access
  end

  def call
    user or raise InvalidRecordError.new(
      "invalid credentials",
      ApiError.new("INVALID_CREDENTIALS")
    )

    UserSession.new(user, site)
  end

  def user
    @user ||= case data[:type]
    when "email_credentials"
      user_with_credentials
    when "invitation"
      register!(user_with_invite_token)
    when "password_reset"
      change_password!(user_with_password_reset_token)
    end
  end

  private

  def user_with_credentials
    site.user_with_credentials(
      data[:attributes][:email],
      data[:attributes][:password]
    )
  end

  def user_with_invite_token
    token = data[:attributes][:token]
    site.user_with_invite_token(token)
  end

  def user_with_password_reset_token
    token = data[:attributes][:token]
    site.user_with_password_reset_token(token)
  end

  def register!(user)
    return unless user

    password = data[:attributes][:password]
    check_policy = data[:attributes][:password]

    user.update_attributes!(
      password: password,
      invite_token: nil,
      check_policy: check_policy
    )

    user
  end

  def change_password!(user)
    return unless user

    password = data[:attributes][:password]

    user.update_attributes!(
      password: password,
      password_reset_token: nil
    )

    user
  end
end
