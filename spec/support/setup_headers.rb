module HeadersFactory
  def parsed_response
    @parsed_response ||= JSON.parse(response.body).with_indifferent_access
  end

  def setup_basic_api_headers
    @request.env["HTTP_ACCEPT"] = "application/json"
    @request.env["CONTENT_TYPE"] = "application/json"
  end

  def setup_private_api_headers
    setup_basic_api_headers
  end

  # TODO: remove site parameter
  def setup_public_api_headers(user = nil)
    setup_basic_api_headers

    if user
      session = UserSession.new(user, site)
      @request.env["HTTP_AUTHORIZATION"] = "Bearer #{session.access_token}"
    end
  end
end

RSpec.configure do |_config|
  include HeadersFactory
end
