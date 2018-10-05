#!/usr/bin/env ruby

require "json"

def load_static_domains(static_domains)
  if !static_domains || static_domains.empty?
    abort("Error: Can't load STATIC_DOMAINS env.")
  end

  JSON.parse(static_domains) if static_domains
rescue JSON::ParserError
  abort("Error: Invalid JSON format")
end

static_domains = ENV["STATIC_DOMAINS"] || []
parsed_static_domains = load_static_domains(static_domains)
template = File.read("./static_servers.conf")

blocks = parsed_static_domains.map do |domain|
  template.gsub("${STATIC_SITE_DOMAIN}", domain["domain"])
end

File.write(
  "/usr/local/openresty/nginx/conf/sites-enabled/https_static_servers.conf",
  blocks.join("\n\n")
)
