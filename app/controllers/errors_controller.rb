class ErrorsController < ApplicationController
  def not_found
    render_error ApiError.new("INVALID_ENDPOINT"), status: 404
  end
end
