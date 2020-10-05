# frozen_string_literal: true

source "https://rubygems.org"

ruby "2.5.1"

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" if !repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem "active_model_serializers", ">= 0.10.0"
gem "addressable"
gem "bcrypt"
gem "delayed_job_active_record"
gem "dnsruby"
gem "email_validator"
gem "faraday"
gem "faraday_curl"
gem "faraday_middleware"
gem "filesize"
gem "http-accept"
gem "inky-rb", require: "inky"
gem "json_schema"
gem "jwt"
gem "language_list"
gem "nilify_blanks"
gem "pg"
gem "premailer-rails"
gem "prmd"
gem "pry-byebug"
gem "pry-rails"
gem "puma"
gem "rack-cors", require: "rack/cors"
gem "rails", "~> 5.2.0"
gem "rake", "< 11.0"
gem "redcarpet"
gem "rest-client", "1.8"
gem "rouge"
gem "ruby-graphviz"
gem "shrine", "~> 3.3"
gem "typhoeus"
gem "validate_url"
gem "validates_hostname"
gem "virtus"

group :development do
  gem "bullet"
  gem "letter_opener"
  gem "spring"
  gem "spring-commands-rspec"
end

group :development, :test do
  gem "dotenv-rails", require: false
  gem "factory_bot_rails"
  gem "rspec-rails"
  gem "rubocop", "0.57.2"
  gem "rubocop-rspec"
end

group :production do
  gem "rails_12factor"
end

group :test do
  gem "database_cleaner"
  gem "shoulda-matchers", require: false
  gem "simplecov", require: false
  gem "timecop"
  gem "webmock"
end
