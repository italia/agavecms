require "rails_helper"

RSpec.describe FieldsController, type: :controller do
  let(:site) { user.site }
  let(:user) { create(:user, :admin) }

  let(:item_type) do
    create(:item_type, site: site)
  end

  before do
    item_type
  end

  describe "GET /fields" do
    let(:action) do
      get :index, params: {item_type_id: item_type.id.to_s}
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      context "with valid payload" do
        let(:field) do
          create(:field, item_type: item_type)
        end

        before do
          field
          action
        end

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :field, :instances)
        end
      end
    end
  end

  describe "GET /fields/:id" do
    let(:field) do
      create(:field, item_type: item_type)
    end

    let(:action) do
      get :show, params: {id: field.id.to_s}
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      context "with valid payload" do
        before do
          field
          action
        end

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :field, :self)
        end
      end
    end
  end

  describe "POST /fields" do
    let(:payload) { {} }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      post :create, params: {item_type_id: item_type.id.to_s}
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
              type: "field",
              attributes: {
                label: "Price",
                api_key: "price",
                hint: "",
                field_type: "float",
                validators: {},
                localized: false,
                position: 12,
                appeareance: {}
              }
            }
          }
        end

        before do
          action
        end

        it "responds with 201" do
          expect(response).to have_http_status(201)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :field, :create)
        end
      end

      context "with validation errors" do
        let(:payload) do
          {
            data: {
              type: "field",
              attributes: {
                label: "",
                api_key: "price",
                hint: "",
                field_type: "float",
                validators: {},
                localized: false,
                position: 12,
                appeareance: {}
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
              type: "field",
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

  describe "PUT /fields/:id" do
    let(:payload) { {} }
    let(:field) { create(:field, item_type: item_type) }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      put :update, params: {id: field.id}
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
              id: field.id.to_s,
              type: "field",
              attributes: {
                label: "Price",
                api_key: "price",
                hint: "",
                validators: {},
                localized: false,
                position: 12,
                appeareance: { type: "plain" }
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
          expect(response).to conform_to_schema(:site_api, :field, :update)
        end

        context "with invalid id" do
          let(:action) do
            request.env["RAW_POST_DATA"] = payload.to_json
            put :update, params: {id: "12"}
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
              type: "field",
              field: "post",
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

  describe "DELETE /fields/:id" do
    let(:payload) { {} }
    let(:field) { create(:field, item_type: item_type) }
    let(:item_type) { create(:item_type, site: site) }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      delete :destroy, params: {id: field.id}
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
        expect(field).not_to exist_in_database
      end

      it "conforms with the response schema" do
        expect(response).to conform_to_schema(:site_api, :field, :destroy)
      end
    end
  end
end
