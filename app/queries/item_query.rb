class ItemQuery
  class InvalidPermissions < StandardError
  end

  attr_reader :site, :params, :role

  def initialize(site, params, role)
    @params = params
    @site = site
    @role = role
  end

  def scope
    scope = starting_scope.includes(item_type: [:fields, :site])
    scope = order(scope)
    scope = only_valid(scope)

    total_count = scope.except(:select).reorder("").count

    [scope.offset(page_offset).limit(page_limit), total_count]
  end

  private

  def only_valid(scope)
    if filters[:only_valid].nil?
      scope
    else
      scope.where(is_valid: true)
    end
  end

  def order(scope)
    if item_type && query.present?
      scope
    elsif item_type && item_type.sortable
      scope.order("position ASC")
    elsif item_type && item_type.ordering_field
      order_by_field(scope)
    else
      scope.order(updated_at: :desc)
    end
  end

  def starting_scope
    if filters[:ids]
      filter_by_ids
    elsif item_type
      filter_by_type
    else
      site.items.
        where(
          item_type_id: role.item_types_with_permitted_action(
            site,
            "read"
          )
        )
    end
  end

  def filter_by_ids
    items = site.items.where(id: filters[:ids].split(/,/))

    items.each do |item|
      role.can_perform_action_on_item_type?(site, item.item_type, "read") or
        raise InvalidPermissions
    end

    items
  end

  def filter_by_type
    role.can_perform_action_on_item_type?(site, item_type, "read") or
      raise InvalidPermissions

    scope = site.items.where(item_type_id: item_type)

    if query
      scope = ItemFullTextSearch.new(
        scope,
        item_type,
        query
      ).call
    end

    scope
  end

  def order_by_field(scope)
    scope

    field = item_type.ordering_field

    ordering_string = "jsonb_extract_path_text(data, '#{field.to_param}'"

    if field.localized
      ordering_string += ", '#{site.locales.first}'"
    end

    ordering_string += ") "
    ordering_string += item_type.ordering_direction.upcase

    scope.order(Arel.sql(ordering_string))
  end

  def filters
    @filters ||= params.fetch(:filter, {}).symbolize_keys
  end

  def page
    params.fetch(:page, {}).symbolize_keys
  end

  def page_limit
    [page.fetch(:limit, 30).to_i, 500].min
  end

  def page_offset
    page.fetch(:offset, 0).to_i
  end

  def query
    filters[:query].presence
  end

  def item_type_id
    filters[:type].presence
  end

  def item_type
    @item_type ||= if item_type_id
                     site.item_type_by_id(item_type_id) or
                     site.item_type_by_api_key(item_type_id) or
                     raise InvalidRecordError.new(
                       "invalid item type \"#{item_type_id}\"",
                       ApiError.new("ITEM_TYPE_NOT_FOUND")
                 )
                   end
  end
end
