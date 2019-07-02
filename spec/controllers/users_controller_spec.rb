require "rails_helper"

RSpec.describe UsersController, type: :controller do
  let(:site) { create(:site) }
  let(:editor) { create(:user, site: site, email: email) }
  let(:admin) { create(:user, :admin, site: site) }
  let(:email) { "foo@bar.it" }

  describe "GET /users" do
    let(:action) { get :index }

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      context "with valid payload" do
        let!(:user) { admin }

        before { action }

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :user, :instances)
        end
      end
    end
  end

  describe "GET /users/:id" do
    let!(:user) { admin }

    let(:action) do
      get :show, params: {id: user.id}
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      context "with valid payload" do
        before { action }

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :user, :self)
        end
      end
    end
  end

  describe "POST /users" do
    let!(:user) { editor }
    let(:payload) { {} }

    let(:action) do
      post :create, body: payload.to_json, format: :json
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      context "as editor" do
        before { action }

        it "returns a 401 status code" do
          expect(response).to have_http_status(401)
        end
      end

      context "as admin" do
        let!(:user) { admin }

        before { action }

        it_behaves_like "an endpoint that validates payload schema"

        context "with valid payload" do
          let(:role) { create(:role, site: site) }

          let(:payload) do
            {
              data: {
                type: "user",
                attributes: {
                  email: email,
                  first_name: "Foo",
                  last_name: "Bar"
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
            expect(response).to conform_to_schema(:site_api, :user, :create)
          end
        end

        context "with validation errors" do
          let(:role) { create(:role, site: site) }

          let(:payload) do
            {
              data: {
                type: "user",
                attributes: {
                  email: email,
                  first_name: "Foo",
                  last_name: "",
                  password: "mesecure"
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

  describe "PUT /users/:id" do
    let(:payload) { {} }
    let!(:user) { admin }
    let(:user_to_update) { user }
    let(:new_role) { create(:role, site: site) }

    let(:action) do
      put :update, params: {id: user_to_update}, body: payload.to_json
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
              id: user_to_update.id.to_s,
              type: "user",
              attributes: {
                email: email,
                first_name: "Foo",
                last_name: "Bar"
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
          expect(response).to conform_to_schema(:site_api, :user, :update)
        end

        it "updates the user" do
          user_to_update.reload
          expect(user_to_update.first_name).to eq "Foo"
        end

        context "trying to edit a user different than themself" do
          let(:user_to_update) do
            create(:user, site: site, first_name: "Mark")
          end

          before do
            action
          end

          it "responds with 200" do
            expect(response).to have_http_status(200)
          end

          it "conforms with the response schema" do
            expect(response).to conform_to_schema(:site_api, :user, :update)
          end

          it "only updates the role" do
            user_to_update.reload
            expect(user_to_update.first_name).to eq "Mark"
            expect(user_to_update.role).to eq new_role
          end
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
              type: "user",
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

  describe "POST /users/reset_password" do
    let(:payload) { {} }
    let(:user) { editor }

    before do
      setup_public_api_headers(user)
    end

    let(:action) do
      post :reset_password, body: payload.to_json
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint that validates payload schema"

    context "with valid headers" do
      context "with valid payload" do
        let(:payload) do
          {
            data: {
              type: "user",
              attributes: {
                email: email
              }
            }
          }
        end

        let!(:user) { super() }
        let!(:action) { super() }

        it "responds with 204" do
          expect(response).to have_http_status(204)
          expect(user.reload.password_reset_token).to be_present
        end

        context "with invalid email" do
          let(:payload) do
            {
              data: {
                type: "user",
                attributes: {
                  email: "qux@bar.it"
                }
              }
            }
          end

          it "responds with 422" do
            expect(response).to have_http_status(422)
          end
        end
      end

      context "with invalid payload" do
        let!(:user) { super() }
        let!(:action) { super() }

        let(:payload) do
          {
            data: {
              type: "foobar",
              attributes: {
                title: "foo bar",
                extraneous_key: "qux"
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

  describe "DELETE /users/:id" do
    let(:payload) { {} }
    let(:user) { create(:user, site: site) }
    let(:current_user) { create(:user, site: site) }

    let(:action) do
      delete :destroy, params: {id: user.id}, body: payload.to_json
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      before do
        setup_public_api_headers(current_user)
      end

      before do
        user
        action
      end

      context "as editor" do
        it "returns a 401 status code" do
          expect(response).to have_http_status(401)
        end
      end

      context "as admin" do
        let(:current_user) { create(:user, :admin, site: site) }

        it "returns a 200 status code" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :user, :update)
        end
      end
    end
  end
end
