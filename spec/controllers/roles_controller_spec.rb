require "rails_helper"

RSpec.describe RolesController, type: :controller do
  let(:site) { user.site }
  let(:user) { create(:user, :admin) }

  describe "GET /roles" do
    let(:action) do
      get :index
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      context "with valid payload" do
        let!(:role)  { create(:role, site: site) }

        let!(:action) do
          setup_public_api_headers(user)
          super()
        end

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :role, :instances)
        end
      end
    end
  end

  describe "GET /roles/:id" do
    let!(:role) { create(:role, site: site) }

    let(:action) do
      get :show, params: {id: role.id}
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      let!(:action) do
        setup_public_api_headers(user)
        super()
      end

      context "with valid payload" do
        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :role, :self)
        end
      end
    end
  end

  describe "POST /roles" do
    let(:payload) { {} }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      post :create
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"
    it_behaves_like "an endpoint that validates payload schema"

    context "with valid headers" do
      let!(:action) do
        setup_public_api_headers(user)
        super()
      end

      context "with valid payload" do
        let(:payload) do
          {
            data: {
              type: "role",
              attributes: {
                name: "Editor",
                can_edit_schema: true,
                can_edit_site: false,
                can_edit_favicon: true,
                can_manage_users: false,
                can_manage_access_tokens: false,
                can_perform_site_search: false,
                can_publish_to_production: true,
                can_dump_data: true,
                can_import_and_export: true,
                positive_item_type_permissions: [
                  { item_type: nil, action: "all" }
                ],
                negative_item_type_permissions: []
              }
            }
          }
        end

        it "responds with 201" do
          expect(response).to have_http_status(201)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :role, :create)
        end
      end

      context "with validation errors" do
        let(:payload) do
          {
            data: {
              type: "role",
              attributes: {
                name: "",
                can_edit_schema: true,
                can_edit_site: false,
                can_edit_favicon: true,
                can_manage_users: false,
                can_manage_access_tokens: false,
                can_perform_site_search: false,
                can_publish_to_production: true,
                can_dump_data: true,
                can_import_and_export: true,
                positive_item_type_permissions: [],
                negative_item_type_permissions: []
              }
            }
          }
        end

        let!(:action) { super() }

        it "responds with 422" do
          expect(response).to have_http_status(422)
        end
      end

      context "with invalid payload" do
        let(:payload) do
          {
            data: {
              type: "role",
              attributes: {
                title: "foo bar",
                extraneous_key: "qux"
              }
            }
          }
        end

        let!(:action) { super() }

        it "responds with 422" do
          expect(response).to have_http_status(422)
        end
      end
    end
  end

  describe "PUT /roles/:id" do
    let(:payload) { {} }
    let(:role) { create(:role, site: site) }
    let(:role_id) { role.id }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      put :update, params: {id: role_id}
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"
    it_behaves_like "an endpoint that validates payload schema"

    context "with valid headers" do
      context "with valid payload" do
        let(:payload) do
          {
            data: {
              id: role.id.to_s,
              type: "role",
              attributes: {
                name: "Editor",
                can_edit_schema: true,
                can_edit_site: false,
                can_edit_favicon: true,
                can_manage_users: false,
                can_manage_access_tokens: false,
                can_perform_site_search: false,
                can_publish_to_production: true,
                can_dump_data: true,
                can_import_and_export: true,
                positive_item_type_permissions: [],
                negative_item_type_permissions: []
              }
            }
          }
        end

        let!(:action) do
          setup_public_api_headers(user)
          super()
        end

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :role, :update)
        end

        context "with invalid id" do
          let(:role_id) { "12" }

          it "responds with 404" do
            expect(response).to have_http_status(404)
          end
        end
      end

      context "with invalid payload" do
        let(:payload) do
          {
            data: {
              type: "role",
              item_type: "post",
              attributes: {
                title: "foo bar",
                extraneous_key: "qux"
              }
            }
          }
        end

        let!(:action) do
          setup_public_api_headers(user)
          super()
        end

        it "responds with 422" do
          expect(response).to have_http_status(422)
        end
      end
    end
  end

  describe "DELETE /roles/:id" do
    let(:payload) { {} }
    let(:role) { create(:role, site: site) }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      delete :destroy, params: {id: role.id}
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      let!(:action) do
        setup_public_api_headers(user)
        super()
      end

      it "responds with 200" do
        expect(response).to have_http_status(200)
      end

      it "destroys the resource" do
        expect(role).not_to exist_in_database
      end

      it "conforms with the response schema" do
        expect(response).to conform_to_schema(:site_api, :role, :destroy)
      end
    end
  end
end
