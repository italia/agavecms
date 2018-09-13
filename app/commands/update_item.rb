class UpdateItem
  attr_reader :item, :attributes

  def initialize(item, attributes)
    data = attributes[:data].with_indifferent_access
    @attributes = data[:attributes]
    @item = item
  end

  def call
    ItemValidator.new(item_type, attributes, item.id).call

    ActiveRecord::Base.transaction do
      if changed?
        move_items_position_if_sortable!
        move_items_position_if_tree!

        destroy_orphaned_linked_items do
          item.update_attributes!(
            data: item.data.merge(new_data),
            is_valid: true
          )
        end

        notify_site_change!
      else
        item.touch
      end
    end

    item
  end

  private

  def notify_site_change!
    NotifySiteChange.new(site).call
  end

  def destroy_orphaned_linked_items
    old_linked_items = NestedItems.new(item).call
    yield
    old_linked_items.each do |item|
      DestroyItemIfOrphan.new(item).call
    end
  end

  def changed?
    old_data != new_data || (
      attributes[:position] && old_position != new_position
    ) || (
      attributes[:parent_id] && old_parent_id != new_parent_id
    )
  end

  def move_items_position_if_sortable!
    return unless item_type.sortable && attributes.has_key?(:position)

    items_to_move = item_type.items.with_positions_between(
      *[old_position, new_position].sort
    ).where.not(id: item.id)

    amount = new_position <= old_position ? 1 : -1
    items_to_move.update_all(["position = position + (?)", amount])

    item.update_attributes!(position: new_position)
  end

  def move_items_position_if_tree!
    return unless item_type.tree && attributes.has_key?(:position) &&
      attributes.has_key?(:parent_id)

    if new_parent_id == old_parent_id
      items_to_move = item_type.items.children_of(old_parent_id).with_positions_between(
        *[old_position, new_position].sort
      ).where.not(id: item.id)
      amount = new_position <= old_position ? 1 : -1
      items_to_move.update_all(["position = position + (?)", amount])

      item.update_attributes!(position: new_position)
    else
      old_siblings_to_move =
        item_type.
        items.
        children_of(old_parent_id).
        with_positions_gte(old_position).
        where.not(id: item.id)
      old_siblings_to_move.update_all("position = position - 1")

      new_siblings_to_move =
        item_type.
        items.
        children_of(new_parent_id).
        with_positions_gte(new_position).
        where.not(id: item.id)
      new_siblings_to_move.update_all("position = position + 1")

      item.update_attributes!(position: new_position, parent_id: new_parent_id)
    end
  end

  def new_data
    @new_data ||= begin
      data = AttributesDumper.new(
        fields, site,
        attributes.except(:position, :parent_id),
        false, true,
        false, true
      ).dumped_attributes

      ReplaceUploadsPayloadWithItemUploadIds.new(
        fields,
        site,
        attributes.except(:position, :parent_id),
        item,
        data
      ).replaced_data
    end
  end

  def old_data
    @old_data ||= item.data.slice(fields.map(&:id).map(&:to_s))
  end

  def old_position
    @old_position ||= item.position
  end

  def new_position
    @new_position ||= attributes[:position]
  end

  def old_parent_id
    @old_parent_id ||= item.parent_id
  end

  def new_parent_id
    @new_parent_id ||= attributes[:parent_id]
  end

  def fields
    item_type.fields.
      select { |field| attributes.keys.include?(field.api_key) }
  end

  def site
    item_type.site
  end

  def item_type
    item.item_type
  end
end
