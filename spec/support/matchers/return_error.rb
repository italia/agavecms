RSpec::Matchers.define :return_error do |code|
  match do |response|
    @payload = JSON.parse(response.body).with_indifferent_access
    @payload[:data].any? do |error|
      error[:type] == "api_error" && error[:id] == code
    end
  end

  failure_message do |_actual|
    [
      "expected that JSON would return error #{code}:",
      JSON.pretty_generate(@payload)
    ].join("\n\n")
  end
end
