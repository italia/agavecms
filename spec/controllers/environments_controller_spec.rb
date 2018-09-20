require 'rails_helper'

RSpec.describe EnvironmentsController, type: :controller do
  let(:site) { user.site }
  let(:user) { create(:user, :admin) }

  describe "GET /environments" do
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
        let(:environment) do
          create(:environment, site: site)
        end

        before do
          environment
          action
        end

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :environment, :instances)
        end
      end
    end
  end

  describe "GET /environments/:id" do
    let(:environment) do
      create(:environment, site: site)
    end

    let(:action) do
      get :show, params: {id: environment.id.to_s}
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      context "with valid payload" do
        before do
          environment
          action
        end

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :environment, :self)
        end
      end
    end
  end

  describe "POST /environments" do
    let(:payload) { {} }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      post :create
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
              type: "environment",
              attributes: {
                name: "environments",
                git_repo_url: "repo_url",
                frontend_url: "frontend_url"
              }
            }
          }
        end
        let(:environment) { create(:environment, site: site) }

        before do
          environment
          action
        end

        it "responds with 201" do
          expect(response).to have_http_status(201)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :environment, :create)
        end
      end

      context "with validation errors" do
        let(:payload) do
          {
            data: {
              type: "environment",
              attributes: {
                name: "",
                git_repo_url: "repo_url",
                frontend_url: "frontend_url"
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
              type: "environment",
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

  describe "PUT /environments/:id" do
    let(:payload) { {} }
    let(:environment) { create(:environment, site: site) }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      put :update, params: {id: environment.id.to_s}
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
              id: environment.id.to_s,
              type: "environment",
              attributes: {
                name: "Post",
                git_repo_url: "git_repo_url",
                frontend_url: "frontend_url"
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
          expect(response).to conform_to_schema(:site_api, :environment, :update)
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
              type: "environment",
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

  describe "DELETE /environments/:id" do
    let(:payload) { {} }
    let(:environment) { create(:environment, site: site) }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      delete :destroy, params: {id: environment.id}
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
        expect(environment).not_to exist_in_database
      end

      it "conforms with the response schema" do
        expect(response).to conform_to_schema(:site_api, :environment, :destroy)
      end
    end
  end
end
