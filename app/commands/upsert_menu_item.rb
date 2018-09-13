class UpsertMenuItem
  attr_reader :site, :data, :menu_item, :new_record,
    :old_position, :old_parent

  def initialize(site, menu_item, attributes)
    @data = attributes[:data].with_indifferent_access
    @site = site
    @menu_item = menu_item
    @new_record = menu_item.new_record?
    @old_position = menu_item.position
    @old_parent = menu_item.parent
  end

  def call
    menu_item.update_attributes!(
      site: site,
      label: data[:attributes][:label],
      position: new_position,
      parent: parent,
      item_type: item_type
    )
    change_positions! unless new_record
  rescue ActiveRecord::RecordInvalid => error
    raise InvalidRecordError.from_record_invalid(error)
  end

  private

  def change_positions!
    if parent == old_parent
      move_siblings_position!
    else
      shift_siblings_positions!
    end
  end

  def move_siblings_position!
    menu_items = siblings.with_positions_between(
      *[old_position, new_position].sort
    ).where.not(id: menu_item.id)

    menu_items.find_each do |menu_item|
      amount = new_position < old_position ? 1 : -1
      menu_item.update_attributes(position: menu_item.position + amount)
    end
  end

  def shift_siblings_positions!
    menu_items =
      siblings.
      with_positions_gte(new_position).
      where.not(id: menu_item.id)
    menu_items.find_each do |menu_item|
      menu_item.update_attributes(position: menu_item.position + 1)
    end
  end

  def new_position
    if new_record
      next_available_position
    else
      data[:attributes][:position]
    end
  end

  def next_available_position
    max_position = siblings.maximum(:position) || 0
    max_position + 1
  end

  def siblings
    if parent
      parent.children
    else
      site.menu_items.roots
    end
  end

  def parent
    linkage = data[:relationships][:parent] &&
      data[:relationships][:parent][:data]

    @parent ||= if linkage
      site.menu_items.find(linkage[:id])
    end
  end

  def item_type
    linkage = data[:relationships][:item_type] &&
      data[:relationships][:item_type][:data]

    @item_type ||= if linkage
      site.item_types.find(linkage[:id])
    end
  end
end
