class ItemTypesController < BaseController
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
    item_types = current_site.item_types
    render json: item_types,
      include: ["fields"]
  end

  def show
    item_type = current_site.item_types.find(params[:id])
    render json: item_type,
      include: ["fields"]
  end

  def create
    item_type = ItemType.new
    UpsertItemType.new(current_site, item_type, payload[:data]).call
    render json: item_type,
      include: ["menu_item"],
      status: 201
  end

  def update
    item_type = current_site.item_types.find(params[:id])
    UpsertItemType.new(current_site, item_type, payload[:data]).call
    render json: item_type, status: 200
  end

  def duplicate
    item_type = current_site.item_types.find(params[:id])
    new_item_type = DuplicateItemType.new(current_site, item_type).call
    render json: new_item_type, status: 201
  end

  def destroy
    item_type = current_site.item_types.find(params[:id])
    DestroyItemType.new(item_type).call
    render json: item_type, status: 200
  end
end
