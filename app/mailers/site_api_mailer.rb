class SiteApiMailer < ApplicationMailer
  def invitation(site, user)
    @site = site
    @user = user
    token = CGI::escape(user.invite_token)
    @url = site.url("/complete_registration?token=#{token}")

    mail(
      to: user.email_address_with_name,
      subject: default_i18n_subject(
        site: site.name,
        name: user.first_name
      )
    )
  end

  def reset_password(site, user)
    @site = site
    @user = user

    token = CGI::escape(user.password_reset_token)
    @url = site.url("/reset_password?token=#{token}")

    mail(
      to: user.email_address_with_name,
      subject: default_i18n_subject(
        site: site.name,
        name: user.first_name
      )
    )
  end
end
