require "seeds"

class TestController < BaseController
  skip_before_action :ensure_current_site!, only: :reset

  def reset
    raise "RAILS_ENV is not test" if !Rails.env.test?

    DatabaseCleaner.strategy = :truncation
    DatabaseCleaner.clean
    Seeds.new.setup
  end

  def session
    session = UserSession.new(User.first, Site.first)

    render json: {data: {token: session.access_token}}
  end
end
