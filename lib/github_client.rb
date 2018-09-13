class GithubClient
  BASE_URL = "https://github.com/login/oauth/access_token"

  private

  def perform_request(connection)
    connection.post do |req|
      req.url(BASE_URL)
      req.body = body
    end
  end

  def complete_url
    uri = Addressable::URI.parse(url)
    uri.normalize.to_s
  end

  def body
    {
      client_id: ENV.fetch("GITHUB_CLIENT_ID"),
      client_secret: ENV.fetch("GITHUB_CLIENT_SECRET"),
      code: settings[:code]
    }
  end

  def configure_connection(connection)
    connection.request :json
    connection.headers[:accept] = "application/json"
  end
end
