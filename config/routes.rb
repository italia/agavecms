if !defined?(API_CRUD_ACTIONS)
  API_CRUD_ACTIONS = %i(index show create update destroy)
end

Rails.application.routes.draw do
  scope "api" do
    mount AttachmentUploader.upload_endpoint(:store) => "/attachments/uploads"

    resource :site, only: %i(show update) do
      member do
        get :diagram
        get :export
        post "import", to: "sites#import"
      end
    end

    resources :environments, only: API_CRUD_ACTIONS

    resource :dumps do
      member do
        get :full_dump
      end
    end

    resources :item_types, path: "/item-types", only: API_CRUD_ACTIONS do
      resources :fields, only: API_CRUD_ACTIONS, shallow: true
      member do
        post :duplicate, to: "item_types#duplicate"
      end
    end

    resources :deploy_events, path: "/deploy-events", only: %i(index show)
    resource :deploys, only: %i(create)

    resources :roles, only: API_CRUD_ACTIONS

    constraints id: /.+/ do
      resources :uploads, only: API_CRUD_ACTIONS
    end

    resources :users, only: API_CRUD_ACTIONS do
      collection do
        get :me
        post :reset_password
      end
    end

    resources :items, only: API_CRUD_ACTIONS do
      collection do
        post :validate, action: :validate_new
      end

      member do
        post :validate, action: :validate_existing
        post :duplicate
      end
    end

    resources :access_tokens, only: API_CRUD_ACTIONS do
      member do
        post :regenerate_token
      end
    end

    resources :sessions, only: :create
    resources :menu_items, path: "/menu-items", only: API_CRUD_ACTIONS

    if Rails.env.test?
      post "/api/test/reset", to: "test#reset"
    end
  end

  # Catch-all routes
  unless Rails.env.development?
    match "*path", to: "errors#not_found", via: :all
    match "/", to: "errors#not_found", via: :all
  end
end
