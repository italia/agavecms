require "rails_helper"

RSpec.describe DeployEventsController, type: :controller do
  let(:site) { user.site }
  let(:user) { create(:user) }

  describe "GET /deploy-events" do
    let(:action) { get :index }

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      let(:event) do
        create(:deploy_event, site: site)
      end

      before do
        setup_public_api_headers(user)
        event
      end

      before { action }

      it "responds with 200" do
        expect(response).to have_http_status(200)
      end

      it "conforms with the response schema" do
        expect(response).to conform_to_schema(:site_api, :deploy_event, :instances)
      end
    end
  end

  describe "GET /deploy-event/:id" do
    let(:action) { get :show, params: {id: event.id }}
    let(:event) { create(:deploy_event, site: site) }

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      before do
        event
        setup_public_api_headers(user)
      end

      before { action }

      it "responds with 200" do
        expect(response).to have_http_status(200)
      end

      it "conforms with the response schema" do
        expect(response).to conform_to_schema(:site_api, :deploy_event, :self)
      end
    end
  end
end
