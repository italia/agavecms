class MenuItemsController < BaseController
  before_action(only: %i(index show)) do
    authentication.role.can_access_site or
      render_invalid_permissions_error!
  end

  before_action(only: %i(create update destroy)) do
    authentication.role.can_edit_schema or
      render_invalid_permissions_error!
  end

  before_action :ensure_payload_schema!,
    only: %i(create update)

  def index
    menu_items = current_site.menu_items
    render json: menu_items
  end

  def show
    menu_item = current_site.menu_items.find(params[:id])
    render json: menu_item
  end

  def create
    menu_item = MenuItem.new
    UpsertMenuItem.new(current_site, menu_item, payload).call
    render json: menu_item, status: 201
  end

  def update
    menu_item = current_site.menu_items.find(params[:id])
    UpsertMenuItem.new(current_site, menu_item, payload).call
    render json: menu_item, status: 200
  end

  def destroy
    menu_item = current_site.menu_items.find(params[:id])
    DestroyMenuItem.new(menu_item).call
    render json: menu_item, each_serializer: MenuItemSerializer, status: 200
  end
end
