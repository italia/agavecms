require "rails_helper"

RSpec.describe AccessTokensController, type: :controller do
  let(:site) { user.site }
  let(:user) { create(:user, :admin) }

  describe "GET /access_tokens" do
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
        let!(:access_token) { create(:access_token, site: site) }

        before do
          action
        end

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :access_token, :instances)
        end
      end
    end
  end

  describe "GET /access_tokens/:id" do
    let(:access_token) do
      create(:access_token, site: site)
    end

    let(:action) do
      get :show, params: {id: access_token.id}
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      context "with valid payload" do
        before do
          access_token
          action
        end

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :access_token, :self)
        end
      end
    end
  end

  describe "POST /access_tokens" do
    let(:payload) { {} }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      post :create
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      context "as admin" do
        let(:access_token) { site.account }

        before do
          action
        end

        it_behaves_like "an endpoint that validates payload schema"

        context "with valid payload" do
          let(:role) { create(:role, site: site) }

          let(:payload) do
            {
              data: {
                type: "access_token",
                attributes: {
                  name: "Test API token"
                },
                relationships: {
                  role: {
                    data: {
                      id: role.to_param,
                      type: "role"
                    }
                  }
                }
              }
            }
          end

          it "returns a 201 status code" do
            expect(response).to have_http_status(201)
          end

          it "conforms with the response schema" do
            expect(response).to conform_to_schema(:site_api, :access_token, :create)
          end
        end

        context "with validation errors" do
          let(:role) { create(:role, site: site) }

          let(:payload) do
            {
              data: {
                type: "access_token",
                attributes: {
                  name: ""
                },
                relationships: {
                  role: {
                    data: {
                      id: role.to_param,
                      type: "role"
                    }
                  }
                }
              }
            }
          end

          it "responds with 422" do
            expect(response).to have_http_status(422)
          end
        end
      end
    end
  end

  describe "PUT /access_tokens/:id" do
    let(:payload) { {} }
    let(:access_token) { create(:access_token, :custom, site: site) }
    let(:new_role) { create(:role, site: site) }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      put :update, params: {id: access_token}
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint that validates payload schema"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      context "with valid payload" do
        let(:payload) do
          {
            data: {
              id: access_token.id.to_s,
              type: "access_token",
              attributes: {
                name: "Foobar"
              },
              relationships: {
                role: {
                  data: {
                    id: new_role.to_param,
                    type: "role"
                  }
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
          expect(response).to conform_to_schema(:site_api, :access_token, :update)
        end

        it "updates the access_token" do
          access_token.reload
          expect(access_token.name).to eq "Foobar"
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
              type: "access_token",
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

  describe "POST /access_tokens/:id/regenerate_token" do
    let(:payload) { {} }
    let(:access_token) do
      create(:access_token, site: site, token: "XXX")
    end

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      post :regenerate_token, params: {id: access_token.id}
    end

    it_behaves_like "an endpoint"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      context "with valid payload" do
        let(:payload) do
          {}
        end

        before do
          access_token
          action
        end

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :access_token, :regenerate_token)
        end
      end
    end
  end

  describe "DELETE /access_tokens/:id" do
    let(:payload) { {} }
    let(:access_token) { create(:access_token, :custom, site: site) }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      delete :destroy, params: {id: access_token.id}
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
        expect(access_token).not_to exist_in_database
      end

      it "conforms with the response schema" do
        expect(response).to conform_to_schema(:site_api, :access_token, :destroy)
      end
    end
  end
end
