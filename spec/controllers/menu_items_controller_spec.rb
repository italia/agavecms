require "rails_helper"

RSpec.describe MenuItemsController, type: :controller do
  let(:site) { user.site }
  let(:user) { create(:user, :admin) }

  describe "GET /menu-items" do
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
        let(:menu_item) do
          create(:menu_item, site: site)
        end

        before do
          menu_item
          action
        end

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :menu_item, :instances)
        end
      end
    end
  end

  describe "GET /menu-items/:id" do
    let(:menu_item) do
      create(:menu_item, site: site)
    end

    let(:action) do
      get :show, params: {id: menu_item.id}
    end

    it_behaves_like "an endpoint"
    it_behaves_like "an endpoint under authorization"

    context "with valid headers" do
      before do
        setup_public_api_headers(user)
      end

      context "with valid payload" do
        before do
          menu_item
          action
        end

        it "responds with 200" do
          expect(response).to have_http_status(200)
        end

        it "conforms with the response schema" do
          expect(response).to conform_to_schema(:site_api, :menu_item, :self)
        end
      end
    end
  end

  describe "POST /menu-items" do
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
              type: "menu_item",
              attributes: {
                label: "Foo bar",
                position: 12
              },
              relationships: {
                parent: {
                  data: {
                    type: "menu_item",
                    id: parent.id.to_s
                  }
                },
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
        let(:parent) { create(:menu_item, site: site) }
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
          expect(response).to conform_to_schema(:site_api, :menu_item, :create)
        end
      end

      context "with validation errors" do
        let(:payload) do
          {
            data: {
              type: "menu_item",
              attributes: {
                label: "",
                position: 12
              },
              relationships: {
                parent: {
                  data: nil
                },
                item_type: {
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
              type: "menu_item",
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

  describe "PUT /menu_items/:id" do
    let(:payload) { {} }
    let(:menu_item) { create(:menu_item, site: site) }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      put :update, params: {id: menu_item}
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
              id: menu_item.id.to_s,
              type: "menu_item",
              attributes: {
                label: "Foo bar",
                position: 12
              },
              relationships: {
                parent: {
                  data: nil
                },
                item_type: {
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
          expect(response).to conform_to_schema(:site_api, :menu_item, :update)
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
              type: "menu_item",
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

  describe "DELETE /menu-items/:id" do
    let(:payload) { {} }
    let(:menu_item) { create(:menu_item, site: site) }

    let(:action) do
      request.env["RAW_POST_DATA"] = payload.to_json
      delete :destroy, params: {id: menu_item.id}
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
        expect(menu_item).not_to exist_in_database
      end

      it "conforms with the response schema" do
        expect(response).to conform_to_schema(:site_api, :menu_item, :destroy)
      end
    end
  end
end
