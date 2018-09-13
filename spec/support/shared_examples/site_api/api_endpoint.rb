RSpec.shared_examples_for "an endpoint" do ||
  context "with an Accept header different than application/json" do
    before do
      @request.env["HTTP_ACCEPT"] = "text/plain"
    end

    it "responds with a 406 status code" do
      action
      expect(response).to have_http_status(406)
    end

    it "responds with a INVALID_ACCEPT_HEADER" do
      action
      expect(response).to return_error("INVALID_ACCEPT_HEADER")
    end
  end
end
