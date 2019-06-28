require "seeds"

class TestController < BaseController
  def reset
    raise "RAILS_ENV is not test" if !Rails.env.test?

    DatabaseCleaner.strategy = :truncation
    DatabaseCleaner.clean
    Seeds.new.setup
  end
end
