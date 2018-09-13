class SendPasswordReset
  attr_reader :site, :data

  def initialize(site, payload)
    @site = site
    @data = payload[:data].with_indifferent_access
  end

  def call
    user or raise InvalidRecordError.new(
      "invalid credentials",
      ApiError.new("INVALID_EMAIL")
    )

    user.update_attributes!(
      password_reset_token: password_reset_token
    )

#    SiteApiMailer.reset_password(site, user).deliver_now
  end

  private

  def user
    @user ||= site.user_with_email(data[:attributes][:email])
  end

  def password_reset_token
    @password_reset_token ||= SecureRandom.hex(25)
  end
end
