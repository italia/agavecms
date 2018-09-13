RSpec::Matchers.define :conform_to_schema do |file, property, rel|
  match do |response|
    @payload = JSON.parse(response.body).with_indifferent_access
    @errors = LinkValidator.find(file, property, rel).
              validate_target_schema(@payload)
    @errors.size.zero?
  end

  failure_message do |_actual|
    message = @errors.map { |e| "* #{e}" }.join("\n")
    [
      "Expected response would conform to target schema:",
      JSON.pretty_generate(@payload),
      message
    ].join("\n\n")
  end
end
