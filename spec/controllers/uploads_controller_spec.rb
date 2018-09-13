require "rails_helper"

RSpec.describe UploadsController, type: :controller do
  let(:site) { user.site }
  let(:user) { create(:user, :admin) }

  describe "GET /uploads" do
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
        let(:upload) do
          create(:upload, site: site)
        end

        before do
          upload
          action
        end

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :upload, :instances)
        end
      end
    end
  end

  describe "GET /uploads/:id" do
    let(:upload) do
      create(:upload, site: site)
    end

    let(:action) do
      get :show, params: {id: upload.id.to_s}
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      context "with valid payload" do
        before do
          upload
          action
        end

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :upload, :self)
        end
      end
    end
  end

  describe "POST /uploads" do
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
              type: "upload",
              attributes: {
                size: 500,
                width: 120,
                height: 120,
                path: "/45/ullalla.jpg",
                format: "jpg",
                alt: "",
                title: "Look at this"
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
          expect(response).to conform_to_schema(:site_api, :upload, :create)
        end
      end

      context "with validation errors" do
        let(:payload) do
          {
            data: {
              type: "upload",
              attributes: {
                title: 500,
                width: "xxx",
                height: 120,
                extraneous_key: "qux",
                alt: ""
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
              type: "upload",
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

  describe "DELETE /uploads/:id" do
    let(:payload) { {} }
    let(:upload) { create(:upload, site: site) }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      delete :destroy, params: {id: upload.id}
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
        expect(upload).not_to exist_in_database
      end

      it "conforms with the response schema" do
        expect(response).to conform_to_schema(:site_api, :upload, :destroy)
      end
    end

    context "upload in use" do
      before do
        setup_public_api_headers(user)
      end

      before do
        create(:item_upload, upload: upload)
      end

      before do
        action
      end

      it "responds with 422" do
        expect(response).to have_http_status(422)
      end
    end
  end

  describe "PUT /uploads/:id" do
    let(:payload) { {} }
    let(:upload) { create(:upload, site: site) }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      put :update, params: {id: upload.id}
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
              id: upload.id.to_s,
              type: "upload",
              attributes: {
                alt: "",
                title: "Something did change"
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
          expect(response).to conform_to_schema(:site_api, :upload, :update)
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
              type: "upload",
              upload: "post",
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
end
