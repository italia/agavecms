require "rails_helper"

RSpec.describe SessionsController, type: :controller do
  let!(:site) { create(:site) }
  let(:user) { nil }

  describe "POST /sessions" do
    let(:payload) { {} }

    let(:action) do
      post :create, body: payload.to_json
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint that validates payload schema"

    context "with valid headers" do
      before do
        setup_public_api_headers
      end

      context "with valid credentials" do
        context "with email credentials" do
          let!(:user) do
            create(:user, site: site, email: email, password: password)
          end

          let(:payload) do
            {
              data: {
                type: "email_credentials",
                attributes: {
                  email: email,
                  password: password
                }
              }
            }
          end

          let(:email) { "foo@bar.com" }
          let(:password) { "password" }
          let!(:action) { super() }

          it "responds with 201" do
            expect(response).to have_http_status(201)
          end

          it "conforms with the response schema" do
            expect(response).to conform_to_schema(:site_api, :session, :create)
          end
        end

        context "with invitation" do
          let!(:user) do
            create(:user, site: site, invite_token: "XXX")
          end

          let(:payload) do
            {
              data: {
                type: "invitation",
                attributes: {
                  token: "XXX",
                  password: "supersecure",
                  check_policy: true
                }
              }
            }
          end

          let!(:action) { super() }

          it "responds with 201" do
            expect(response).to have_http_status(201)
          end

          it "conforms with the response schema" do
            expect(response).to conform_to_schema(:site_api, :session, :create)
          end

          it "updates the user password and clears invitation token" do
            user.reload
            expect(user.invite_token).to be_nil
            expect(user.authenticate("supersecure")).to be_truthy
          end
        end

        context "with password reset token" do
          let!(:user) do
            create(:user, site: site, password_reset_token: "XXX")
          end

          let(:payload) do
            {
              data: {
                type: "password_reset",
                attributes: {
                  token: "XXX",
                  password: "supersecure",
                  check_policy: true
                }
              }
            }
          end

          let!(:action) { super() }

          it "responds with 201" do
            expect(response).to have_http_status(201)
          end

          it "conforms with the response schema" do
            expect(response).to conform_to_schema(:site_api, :session, :create)
          end

          it "updates the user password and clears invitation token" do
            user.reload
            expect(user.password_reset_token).to be_nil
            expect(user.authenticate("supersecure")).to be_truthy
          end
        end
      end

      context "with invalid credentials" do
        let!(:action) { super() }

        it "responds with 422" do
          expect(response).to have_http_status(422)
        end
      end
    end
  end
end
