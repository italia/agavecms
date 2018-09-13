class SessionsController < BaseController
  before_action :ensure_payload_schema!

  def create
    session = SigninOrCompleteRegistration.new(
      current_site,
      payload
    ).call

    render json: session, include: ["user"], status: 201
  end
end
