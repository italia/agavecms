source "https://rubygems.org"

ruby "2.5.1"

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" if !repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem "active_model_serializers", ">= 0.10.0"
gem "addressable"
gem "bcrypt"
gem "email_validator"
gem "delayed_job_active_record"
gem "faraday"
gem "faraday_middleware"
gem "faraday_curl"
gem "inky-rb", require: "inky"
gem "json_schema"
gem "jwt"
gem "language_list"
gem "pg"
gem "prmd"
gem "pry-byebug"
gem "pry-rails"
gem "rails", "~> 5.2.0"
gem "rake", "< 11.0"
gem "redcarpet"
gem "rouge"
gem "ruby-graphviz"
gem "validate_url"
gem "validates_hostname"
gem "virtus"
gem "nilify_blanks"
gem "filesize"
gem "rack-cors", require: "rack/cors"
gem "dnsruby"
gem "rest-client", "1.8"
gem "shrine", "~> 2.0"
gem "puma"
gem "typhoeus"
gem "http-accept"
gem "premailer-rails"

group :development do
  gem "spring"
  gem "spring-commands-rspec"
  gem "letter_opener"
  gem "bullet"
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
  gem "simplecov", require: false
  gem "database_cleaner"
  gem "shoulda-matchers", require: false
  gem "webmock"
  gem "timecop"
end
