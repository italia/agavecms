class UserSerializer < ApplicationSerializer
  attributes :first_name, :last_name, :email, :state, :activate_url
  belongs_to :role

  def state
    if object.invite_token
      "INVITATION_PENDING"
    elsif object.password_reset_token
      "RESET PASSWORD"
    else
      "REGISTERED"
    end
  end

  def activate_url
    site = Site.last
    if object.invite_token
      token = CGI::escape(object.invite_token)
      site.url("/complete_registration?token=#{token}")
    elsif object.password_reset_token
      token = CGI::escape(object.password_reset_token)
      site.url("/reset_password?token=#{token}")
    end
  end
end
