require "seeds"

class TestController < BaseController
  before_action :permit_only_test_environment
  skip_before_action :ensure_current_site!, only: :reset

  def reset
    DatabaseCleaner.strategy = :truncation
    DatabaseCleaner.clean
    Seeds.new.setup
  end

  def session
    session = UserSession.new(User.first, Site.first)

    render json: {data: {token: session.access_token}}
  end

  private

  def permit_only_test_environment
    raise "RAILS_ENV is not test" if !Rails.env.test?
  end
end
