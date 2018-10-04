#!/usr/bin/env ruby

require "dotenv"
require "json"

Dotenv.load("../../.env", ".env")

def load_static_domains(static_domains)
  JSON.parse(static_domains)
rescue JSON::ParserError
  puts "Error: Invalid JSON format"
end

static_domains = ENV["STATIC_DOMAINS"]
parsed_static_domains = load_static_domains(static_domains)

if !static_domains || !parsed_static_domains
  abort("Error: Can't load STATIC_DOMAINS env.")
end

template = File.read("./app.conf")

blocks = begin
  parsed_static_domains.map do |domain|
    result = template.sub("${APP_DOMAIN}", domain["domain"])

    result.sub!(
      "root /webserver/agave;",
      "root /webserver/agave/#{domain['name']};"
    )

    result.sub!(
      "access_log /var/log/nginx/app_access.log;",
      "access_log /var/log/nginx/app_#{domain['name']}_access.log;"
    )

    result.sub!(
      "error_log /var/log/nginx/app_error.log;",
      "error_log /var/log/nginx/app_#{domain['name']}_error.log;"
    )
  end
end

File.write(
  "/usr/local/openresty/nginx/conf/sites-enabled/https_app.conf",
  blocks.join("\n\n")
)
