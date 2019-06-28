require "seeds"

class TestController < BaseController
  skip_before_action :ensure_current_site!, only: :reset

  def reset
    raise "RAILS_ENV is not test" if !Rails.env.test?

    DatabaseCleaner.strategy = :truncation
    DatabaseCleaner.clean
    Seeds.new.setup
  end
end
