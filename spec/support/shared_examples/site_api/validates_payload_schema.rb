RSpec.shared_examples_for "an endpoint that validates payload schema" do
  context "with invalid payload data" do
    before do
      setup_public_api_headers(user)
      action
    end

    it "returns a 422 status code" do
      expect(response).to have_http_status(422)
    end

    it "responds with a INVALID_FORMAT error code" do
      expect(response).to return_error("INVALID_FORMAT")
    end
  end
end
