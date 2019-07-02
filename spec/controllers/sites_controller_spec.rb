require "rails_helper"

RSpec.describe SitesController, type: :controller do
  let(:site) { user.site }
  let(:user) { create(:user, :admin) }

  describe "GET /site" do
    let(:action) do
      get :show
    end

    it_behaves_like "an endpoint"

    context "with valid headers" do
      let(:menu_item) { create(:menu_item, site: site, item_type: item_type) }
      let(:child_menu_item) { create(:menu_item, site: site, item_type: item_type, parent: menu_item) }
      let(:item_type) { create(:item_type, site: site) }
      let(:field) { create(:field, item_type: item_type) }

      before do
        menu_item
        child_menu_item
        field
      end

      before do
        setup_public_api_headers(user)
        action
      end

      it "returns a 200 status code" do
        expect(response).to have_http_status(200)
      end

      it "conforms with the response schema" do
        expect(response).to conform_to_schema(:site_api, :site, :self)
      end
    end
  end

  describe "PUT /site" do
    let(:payload) { {} }

    let(:action) do
      put :update, body: payload.to_json
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"
    it_behaves_like "an endpoint that validates payload schema"

    context "as user" do
      context "with valid headers" do
        before do
          setup_public_api_headers(user)
          action
        end

        context "with valid payload" do
          let(:payload) do
            {
              data: {
                id: site.id.to_s,
                type: "site",
                attributes: {
                  no_index: true,
                  favicon: nil,
                  global_seo: {
                    site_name: "Foo bar",
                    title_suffix: nil,
                    twitter_account: nil,
                    facebook_page_url: nil,
                    fallback_seo: {
                      title: "Foo bar",
                      description: "Lorem ipsum dolor sit amet",
                      image: nil
                    }
                  }
                }
              }
            }
          end

          it "returns a 200 status code" do
            expect(response).to have_http_status(200)
          end

          it "conforms with the response schema" do
            expect(response).to conform_to_schema(:site_api, :site, :update)
          end
        end
      end
    end
  end

  describe "GET diagram" do
    let(:action) do
      get :diagram
    end

    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      before do
        item_type = create(:item_type, site: site)
        create(
          :field,
          item_type: item_type,
          field_type: "link",
          appeareance: { type: "embed" },
          validators: {
            item_item_type: { item_types: [item_type.id.to_s] }
          }
        )

        setup_public_api_headers(user)
        action
      end

      it "generates a PDF representing the site schema" do
        expect(response.header["Content-Type"]).to include "application/pdf"
      end
    end
  end
end
