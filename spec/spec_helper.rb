require 'shoulda/matchers'

ENV["DASHBOARD_BASE_URL"] = "http://127.0.0.1:3002"

require "simplecov"
SimpleCov.start "rails"

require "webmock/rspec"
require "active_support/all"

ActiveSupport::Dependencies.autoload_paths.unshift(
  File.join(__dir__, "../lib")
)

RSpec.configure do |config|
  config.include(Shoulda::Matchers::ActiveModel, type: :model)
  config.include(Shoulda::Matchers::ActiveRecord, type: :model)
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  config.filter_run :focus
  config.run_all_when_everything_filtered = true
  config.disable_monkey_patching!
  config.example_status_persistence_file_path = "tmp/rspec_failures.txt"

  config.order = :random

  Kernel.srand config.seed
end
