class FieldsController < BaseController
  before_action(only: %i(create update destroy)) do
    authentication.role.can_edit_schema or
      render_invalid_permissions_error!
  end

  before_action(only: %i(index show)) do
    authentication.role.can_access_site or
      render_invalid_permissions_error!
  end

  before_action :ensure_payload_schema!,
    only: %i(create update)

  def index
    render json: item_item_type.fields
  end

  def show
    field = current_site.fields.find(params[:id])
    render json: field
  end

  def create
    field = Field.new(item_type: item_item_type)
    UpsertField.new(field, payload).call
    render json: field, status: 201
  end

  def update
    field = current_site.fields.find(params[:id])
    UpsertField.new(field, payload).call
    render json: field, status: 200
  end

  def destroy
    field = current_site.fields.find(params[:id])
    DestroyField.new(field).call
    render json: field, status: 200
  end

  private

  # do not override ActionController #item_type method!
  def item_item_type
    @item_item_type ||= current_site.item_types.
      find(params[:item_type_id])
  end
end
