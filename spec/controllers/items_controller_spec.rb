require "rails_helper"

RSpec.describe ItemsController, type: :controller do
  let(:site) { create(:site) }

  let(:user) do
    create(:user, site: site)
  end

  let(:item_type) do
    create(:item_type, site: site, api_key: "post")
  end

  let(:field) do
    create(
      :field,
      item_type: item_type,
      api_key: "title",
      field_type: "string"
    )
  end

  before do
    item_type
    field
  end

  describe "POST /items" do
    let(:payload) { {} }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      post :create
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint that validates payload schema"

    context do
      let(:payload) do
        {
          data: {
            relationships: {
              item_type: {
                data: {
                  id: item_type.id.to_s
                }
              }
            }
          }
        }
      end

      it_behaves_like "an endpoint under authorization"
    end

    context "with valid headers" do
      let(:user) do
        create(:user, :admin, site: site)
      end

      before do
        setup_public_api_headers(user)
      end

      context "with valid payload" do
        let(:payload) do
          {
            data: {
              type: "item",
              attributes: {
                title: "foo bar"
              },
              relationships: {
                item_type: {
                  data: {
                    type: "item_type",
                    id: item_type.id.to_s
                  }
                }
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
          expect(response).to conform_to_schema(:site_api, :item, :create)
        end
      end

      context "with invalid payload" do
        let(:payload) do
          {
            data: {
              type: "item",
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

  describe "POST /items/validate" do
    let(:payload) { {} }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      post :validate_new
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
              type: "item",
              attributes: {
                title: "foo bar"
              },
              relationships: {
                item_type: {
                  data: {
                    type: "item_type",
                    id: item_type.id.to_s
                  }
                }
              }
            }
          }
        end

        before do
          action
        end

        it "responds with 204" do
          expect(response).to have_http_status(204)
        end
      end

      context "with invalid payload" do
        let(:payload) do
          {
            data: {
              type: "item",
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

  describe "GET /items" do
    let(:params) { { filter: { type: item_type.id.to_s } } }

    let(:user) do
      create(:user, :admin, site: site)
    end

    let(:action) do
      get :index, params: params
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      context "with valid payload" do
        let(:post) do
          create(
            :item,
            item_type: item_type,
            data: { title: "Ciao" }
          )
        end

        before do
          post
          action
        end

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :item, :instances)
        end
      end
    end
  end

  describe "GET /items/:id" do
    let(:post) do
      create(
        :item,
        item_type: item_type,
        data: { title: "Ciao" }
      )
    end

    let(:action) do
      get :show, params: {id: post.id}
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      context "with valid payload" do
        let(:user) do
          create(:user, :admin, site: site)
        end

        before do
          post
          action
        end

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :item, :self)
        end
      end
    end
  end

  describe "PUT /items/:id" do
    let(:user) { create(:user, :admin, site: site) }
    let(:payload) { {} }
    let(:item) { create(:item, item_type: item_type) }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      put :update, params: {id: item}
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
              type: "item",
              id: item.id.to_s,
              attributes: {
                title: "foo bar"
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
          expect(response).to conform_to_schema(:site_api, :item, :update)
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
              type: "item",
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

  describe "DELETE /items/:id" do
    let(:payload) { {} }
    let(:item) { create(:item, item_type: item_type) }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      delete :destroy, params: {id: item.id}
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      let(:user) do
        create(:user, :admin, site: site)
      end

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
        expect(item).not_to exist_in_database
      end

      it "conforms with the response schema" do
        expect(response).to conform_to_schema(:site_api, :item, :destroy)
      end
    end
  end
end
