RSpec.shared_examples_for "an endpoint under authorization" do
  context "with no authorization token" do
    before do
      site
    end

    before do
      setup_public_api_headers
      action
    end

    it "returns a 401 status code" do
      expect(response).to have_http_status(401)
    end

    it "responds with a INSUFFICIENT_PERMISSIONS error code" do
      expect(response).to return_error("INSUFFICIENT_PERMISSIONS")
    end
  end

  context "with invalid authorization token" do
    let(:user) { create(:user) }
    let(:site) { create(:site) }

    before do
      setup_public_api_headers(user)
      action
    end

    it "returns a 401 status code" do
      expect(response).to have_http_status(401)
    end

    it "responds with a INSUFFICIENT_PERMISSIONS error code" do
      expect(response).to return_error("INSUFFICIENT_PERMISSIONS")
    end
  end
end
