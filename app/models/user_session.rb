class UserSession
  include ActiveModel::Model
  include ActiveModel::Serializers::JSON

  attr_reader :user, :site

  def self.from_access_token(token)
    payload, = JWT.decode(token, Rails.application.secrets.jwt_secret)

    site = Site.where(id: payload["site_id"]).first
    site or return nil

    user = if payload["user_email"]
             site.users.where(email: payload["user_email"]).first
           end

    user or return nil

    new(user, site)
  rescue ActiveRecord::RecordNotFound, JWT::DecodeError
    nil
  end

  def initialize(user, site)
    @user = user
    @site = site
  end

  def access_token
    token_data = {
      site_id: site.id,
      user_email: user.email
    }

    JWT.encode(token_data, Rails.application.secrets.jwt_secret)
  end

  alias_method :id, :access_token
end
