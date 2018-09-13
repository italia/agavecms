class ApplicationController < ActionController::API
  include ActionController::Serialization

  rescue_from InvalidRecordError do |exception|
    render_errors exception.errors
  end

  rescue_from ActiveRecord::RecordNotFound do |ex|
    render_error ApiError.new(
      "NOT_FOUND",
      message: ex.message
    ), status: 404
  end

  rescue_from ActiveRecord::RecordInvalid do |exception|
    render_errors InvalidRecordError.from_record_invalid(exception).errors
  end

  rescue_from ActionDispatch::Http::Parameters::ParseError do
    render_error ApiError.new("INVALID_JSON_BODY"), status: 415
  end

  private

  def ensure_accept_header!
    unless request.headers["Accept"] =~ /json/
      render_error ApiError.new("INVALID_ACCEPT_HEADER"), status: 406
    end
  end

  def ensure_content_type_header!
    return if request.get?

    is_json = request.headers["Content-Type"] =~ /json/

    if !is_json
      render_error ApiError.new("INVALID_CONTENT_TYPE_HEADER"), status: 415
    end
  end

  def render_errors(errors, options = {})
    options[:status] ||= 422
    render options.merge(json: errors)
  end

  def render_error(error, options = {})
    render_errors Array(error), options
  end

  def payload
    @payload ||= begin
                   result = JSON.parse(request.body.read)
                   if result.is_a? Hash
                     result.with_indifferent_access
                   else
                     result
                   end
                 rescue JSON::ParserError
                   render_error ApiError.new("INVALID_JSON_BODY"), status: 415
                 end
  end

  def payload_attributes
    payload[:data][:attributes].dup
  end

  def authorization_key
    @authorization_key ||= begin
      if request.headers["Authorization"].present?
        request.headers["Authorization"].split(" ").last
      else
        params[:auth_token].presence
      end
    end
  end
end
