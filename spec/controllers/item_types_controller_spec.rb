require "rails_helper"

RSpec.describe ItemTypesController, type: :controller do
  let(:site) { user.site }
  let(:user) { create(:user, :admin) }

  describe "GET /item-types" do
    let(:action) do
      get :index
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      context "with valid payload" do
        let(:item_type) do
          create(:item_type, site: site)
        end
        let(:field) do
          create(:field, item_type: item_type)
        end

        before do
          item_type
          field
          action
        end

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :item_type, :instances)
        end
      end
    end
  end

  describe "GET /item-types/:id" do
    let(:item_type) do
      create(:item_type, site: site)
    end

    let(:action) do
      get :show, params: {id: item_type.id.to_s}
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      context "with valid payload" do
        before do
          item_type
          action
        end

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :item_type, :self)
        end
      end
    end
  end

  describe "POST /item-types" do
    let(:payload) { {} }

    let(:action) do
      post :create, body: payload.to_json
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"
    it_behaves_like "an endpoint that validates payload schema"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      context "with valid payload" do
        let(:payload) do
          {
            data: {
              type: "item_type",
              attributes: {
                name: "Post",
                api_key: "post",
                singleton: true,
                sortable: false,
                ordering_direction: nil,
                tree: false
              },
              relationships: {
                ordering_field: {
                  data: nil
                }
              }
            }
          }
        end
        let(:parent) { create(:item_type, site: site) }
        let(:item_type) { create(:item_type, site: site) }

        before do
          parent
          item_type
          action
        end

        it "responds with 201" do
          expect(response).to have_http_status(201)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :item_type, :create)
        end
      end

      context "with validation errors" do
        let(:payload) do
          {
            data: {
              type: "item_type",
              attributes: {
                name: "",
                api_key: "post",
                singleton: true,
                sortable: true,
                ordering_direction: nil
              },
              relationships: {
                ordering_field: {
                  data: nil
                }
              }
            }
          }
        end

        before do
          action
        end

        it "responds with 422" do
          expect(response).to have_http_status(422)
        end
      end

      context "with invalid payload" do
        let(:payload) do
          {
            data: {
              type: "item_type",
              attributes: {
                title: "foo bar",
                extraneous_key: "qux"
              }
            }
          }
        end

        before do
          action
        end

        it "responds with 422" do
          expect(response).to have_http_status(422)
        end
      end
    end
  end

  describe "PUT /item-types/:id" do
    let(:payload) { {} }
    let(:item_type) { create(:item_type, site: site) }

    let(:action) do
      put :update,
        params: {id: item_type.id.to_s},
        body: payload.to_json
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"
    it_behaves_like "an endpoint that validates payload schema"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      context "with valid payload" do
        let(:payload) do
          {
            data: {
              id: item_type.id.to_s,
              type: "item_type",
              attributes: {
                name: "Post",
                api_key: "post",
                singleton: true,
                sortable: false,
                ordering_direction: nil,
                tree: true
              },
              relationships: {
                ordering_field: {
                  data: nil
                }
              }
            }
          }
        end

        before do
          action
        end

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :item_type, :update)
        end

        context "with invalid id" do
          let(:action) do
            put :update, params: {id: "12"}, body: payload.to_json
          end

          before do
            action
          end

          it "responds with 404" do
            expect(response).to have_http_status(404)
          end
        end
      end

      context "with invalid payload" do
        let(:payload) do
          {
            data: {
              type: "item_type",
              item_type: "post",
              attributes: {
                title: "foo bar",
                extraneous_key: "qux"
              }
            }
          }
        end

        before do
          action
        end

        it "responds with 422" do
          expect(response).to have_http_status(422)
        end
      end
    end
  end

  describe "DELETE /item-types/:id" do
    let(:payload) { {} }
    let(:item_type) { create(:item_type, site: site) }

    let(:action) do
      delete :destroy,
        params: {id: item_type.id},
        body: payload.to_json
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      before do
        action
      end

      it "responds with 200" do
        expect(response).to have_http_status(200)
      end

      it "destroys the resource" do
        expect(item_type).not_to exist_in_database
      end

      it "conforms with the response schema" do
        expect(response).to conform_to_schema(:site_api, :item_type, :destroy)
      end
    end
  end
end
