class CatchJsonParseErrors
  ERROR = {
    data: [
      {
        id: "INVALID_JSON_BODY",
        type: "api_error",
        attributes: {
          details: {
            messages: ["The JSON you submitted is not valid"]
          }
        }
      }
    ]
  }

  def initialize(app)
    @app = app
  end

  def call(env)
    @app.call(env)
  rescue ActionDispatch::Http::Parameters::ParseError => error
    if env["CONTENT_TYPE"] =~ /application\/json/
      return [
        400, { "Content-Type" => "application/json" },
        [ERROR.to_json]
      ]
    else
      raise error
    end
  end
end
