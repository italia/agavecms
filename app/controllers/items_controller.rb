class ItemsController < BaseController
  before_action(only: [:create, :duplicate]) do
    id = begin
      payload[:data][:relationships][:item_type][:data][:id]
    rescue StandardError
      nil
    end

    item_type = current_site.item_type_by_id(id)

    if item_type
      allowed = authentication.role.can_perform_action_on_item_type?(
        current_site,
        item_type,
        "create"
      )

      allowed or render_invalid_permissions_error!
    end
  end

  before_action(only: :update) do
    item = current_site.items.find(params[:id])

    allowed = authentication.role.can_perform_action_on_item_type?(
      current_site,
      item.item_type,
      "update"
    )

    allowed or render_invalid_permissions_error!
  end

  before_action(only: :destroy) do
    item = current_site.items.find(params[:id])

    allowed = authentication.role.can_perform_action_on_item_type?(
      current_site,
      item.item_type,
      "delete"
    )

    allowed or render_invalid_permissions_error!
  end

  before_action(only: %i(validate_new validate_existing)) do
    authentication.role.can_access_site or
      render_invalid_permissions_error!
  end

  before_action :ensure_payload_schema!,
    only: %i(create update validate_new validate_existing)

  NO_RESULTS_RESPONSE = {
    data: [],
    meta: { total_count: 0 }
  }.freeze

  def index
    items, total_count = ItemQuery.new(
      current_site,
      params.to_unsafe_hash,
      authentication.role
    ).scope

    item_uploads_ids = items.
      includes(item_type: :fields).
      group_by(&:item_type).
      map do |item_type, item_type_items|
      ItemUploadsIds.new(
        Item.where(id: item_type_items.map(&:id)),
        item_type,
        current_site.locales
      ).call
    end.
      flatten

    item_uploads = ItemUpload.joins(upload: :site).
      where(
      "sites.id = ? AND item_uploads.id IN (?)",
      current_site.id,
      item_uploads_ids
    ).
      includes(:upload)

    if total_count > 0
      render(
        json: items,
        meta: { total_count: total_count },
        item_uploads_cache: item_uploads.index_by(&:id),
        users_cache: current_site.users.index_by(&:id)
      )
    else
      render json: NO_RESULTS_RESPONSE
    end

  rescue ItemQuery::InvalidPermissions
    render_invalid_permissions_error!
  end

  def show
    items = current_site.items.includes(item_type: :fields).
      where(id: params[:id])

    item = items.first

    item or raise ActiveRecord::RecordNotFound

    item_uploads_ids = ItemUploadsIds.new(
      items,
      item.item_type,
      current_site.locales
    ).call

    item_uploads = ItemUpload.joins(upload: :site).
      where(
      "sites.id = ? AND item_uploads.id IN (?)",
      current_site.id,
      item_uploads_ids
    ).
      includes(:upload)

    allowed = authentication.role.can_perform_action_on_item_type?(
      current_site,
      item.item_type,
      "read"
    )

    if allowed
      render json: item, item_uploads_cache: item_uploads.index_by(&:id)
    else
      render_invalid_permissions_error!
    end
  end

  def create
    item = CreateItem.new(current_site, payload).call
    render json: item, include: ["item_type"], status: 201
  end

  def duplicate
    item = current_site.items.find(params[:id])
    new_item = DuplicateItem.new(item, true).call
    render json: item, include: ["item_type"], status: 201
  end

  def validate_new
    ValidateItem.new(current_site, payload, nil).call
    render nothing: true, status: 204
  end

  def validate_existing
    item = current_site.items.find(params[:id])
    ValidateItem.new(current_site, payload, item.id).call
    render nothing: true, status: 204
  end

  def update
    item = current_site.items.find(params[:id])
    item = UpdateItem.new(item, payload).call
    render json: item, status: 200
  end

  def destroy
    item = current_site.items.find(params[:id])
    DestroyItem.new(item).call
    render json: item, status: 200
  end
end
