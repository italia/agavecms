class Seeds
  def setup
    site = Site.first_or_initialize

    site.update_attributes!(
      name: "Agave",
      domain: ENV.fetch("APP_DOMAIN"),
      timezone: "Europe/Rome",
      locales: "{it}",
      production_webhook_token: "production_webhook_token",
      theme: {
        "logo" => nil,
        "dark_color" => {
          "red" => 46, "blue" => 41, "alpha" => 255, "green" => 41
        },
        "light_color" => {
          "red" => 227, "blue" => 245, "alpha" => 255, "green" => 252
        },
        "accent_color" => {
          "red" => 20, "blue" => 148, "alpha" => 255, "green" => 204
        },
        "primary_color" => {
          "red" => 17, "blue" => 126, "alpha" => 255, "green" => 178
        }
      }
    )

    access_token
    role

    read_token = ENV["READ_ACCESS_TOKEN"] || "rtoken"

    read_access_token = AccessToken.where(
      site: site,
      name: "read",
      hardcoded_type: "readonly"
    ).first_or_initialize

    read_access_token.update_attributes!(token: read_token)

    RoleItemTypePermission.where(
      role: role,
      action: "all"
    ).first_or_create!

    u = User.where(
      site: site,
    ).first_or_initialize

    if !u.id
      u.email = ENV.fetch("ADMIN_EMAIL")
      u.password = ENV.fetch("ADMIN_PASSWORD")
    end

    u.update_attributes!(
      first_name: "Admin",
      last_name: "User",
      role: role
    )
  end

  def cy_setup
    setup
    access_token.update_attributes!(role: role)
  end

  private

  def access_token
    @access_token ||= begin
      AccessToken.where(
        site: site,
        name: "rwtoken",
        hardcoded_type: "admin"
      ).first_or_initialize
      read_write_token = ENV["READ_WRITE_ACCESS_TOKEN"] || "rwtoken"
      access_token.update_attributes!(token: read_write_token)
    end
  end

  def role
    @role ||= begin
      Role.where(
        site: site,
        name: "Admin"
      ).first_or_initialize

      role.update_attributes!(
        can_edit_site: true,
        can_edit_schema: true,
        can_manage_users: true,
        can_publish_to_production: true,
        can_edit_favicon: true,
        can_manage_access_tokens: true,
        can_perform_site_search: true,
        can_dump_data: true,
        can_import_and_export: true
      )
    end
  end
end
