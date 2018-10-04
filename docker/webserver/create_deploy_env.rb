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
template = File.read("./static_site.conf")

blocks = begin
  parsed_static_domains.map do |domain|
    result = template.gsub("${STATIC_SITE_DOMAIN}", domain["domain"])
  end
end

File.write(
  "/usr/local/openresty/nginx/conf/sites-enabled/https_app.conf",
  blocks.join("\n\n")
)
