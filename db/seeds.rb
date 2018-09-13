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
      "red" => 51, "blue" => 51, "alpha" => 255, "green" => 51
    },
    "light_color" => {
      "red" => 227, "blue" => 252, "alpha" => 255, "green" => 248
    },
    "accent_color" => {
      "red" => 20, "blue" => 204, "alpha" => 255, "green" => 173
    },
    "primary_color" => {
      "red" => 17, "blue" => 178, "alpha" => 255, "green" => 151
    }
  }
)

read_write_token = ENV["READ_WRITE_ACCESS_TOKEN"] || "rwtoken"

access_token = AccessToken.where(
  site: site,
  name: "rwtoken",
  hardcoded_type: "admin"
).first_or_initialize

access_token.update_attributes!(token: read_write_token)

role = Role.where(
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
  can_perform_site_search: true
)

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
