require File.expand_path("../boot", __FILE__)
require "./lib/middleware/catch_json_parse_errors.rb"

require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"

case Rails.env
when "development"
  require "dotenv"
  Dotenv.load(".env.development")
when "test"
  require "dotenv"
  Dotenv.load(".env.test")
else
  require "dotenv"
  Dotenv.load(".env")
end

Bundler.require(*Rails.groups)

module AgaveApi
  class Application < Rails::Application
    config.autoload_paths << Rails.root.join("lib")
    config.eager_load_paths << Rails.root.join("lib")

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins "*"
        resource /^.*$/,
          headers: :any, methods: %i(get post put options delete)
      end
    end

    config.middleware.insert_before Rack::Head, CatchJsonParseErrors

    config.middleware.use Rack::Deflater

    config.i18n.default_locale = :it

    config.action_mailer.preview_path = "#{Rails.root}/lib/mailer_previews"

    config.active_job.queue_adapter = :delayed_job
  end
end
