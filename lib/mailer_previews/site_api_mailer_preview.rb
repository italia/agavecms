class SiteApiMailerPreview < ActionMailer::Preview
  def invitation_email
    user = User.first
    site = user.site

    user.invite_token = "XXX"

    SiteApiMailer.invitation(site, user)
  end

  def reset_password
    user = User.first
    site = user.site
    user.password_reset_token = "XXX"

    SiteApiMailer.reset_password(site, user)
  end
end
