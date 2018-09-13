require "set"

class CreateItem
  attr_reader :site, :attributes

  def initialize(site, attributes)
    data = attributes[:data].with_indifferent_access
    @item_type_id = data[:relationships][:item_type][:data][:id]
    @attributes = data[:attributes]
    @site = site
  end

  def call
    check_for_valid_item_type!
    check_for_existing_item_if_singleton!

    ItemValidator.new(item_type, attributes, nil).call

    item = create_item
    touch_site!

    item
  end

  private

  def create_item
    data = AttributesDumper.new(
      fields,
      site,
      attributes.except(:position, :parent_id),
      false, true,
      false, true
    ).dumped_attributes

    item = Item.create!(
      item_type: item_type,
      data: data,
      position: next_available_position,
      is_valid: true
    )

    item.data = ReplaceUploadsPayloadWithItemUploadIds.new(
      fields.where(field_type: Field::FIELD_TYPES_WITH_UPLOADS),
      site,
      attributes.except(:position),
      item,
      item.data
    ).replaced_data

    item.save!

    if item_type.singleton && !item_type.singleton_item
      item_type.update_attributes!(singleton_item: item)
    end

    item
  end

  def touch_site!
    NotifySiteChange.new(site).call
  end

  def item_type
    @item_type ||= site.item_type_by_id(@item_type_id)
  end

  def next_available_position
    if item_type.tree
      max_position = item_type.items.children_of(nil).maximum(:position) || 0
      max_position + 1
    else
      max_position = item_type.items.maximum(:position) || 0
      max_position + 1
    end
  end

  def check_for_valid_item_type!
    item_type or
      raise InvalidRecordError.new(
      "invalid item type \"#{@item_type_id}\"",
      ApiError.new("INVALID_TYPE")
    )
  end

  def check_for_existing_item_if_singleton!
    if item_type.singleton
      item_type.singleton_item.nil? or
        raise InvalidRecordError.new(
        "singleton already exists for item type \"#{@item_type_id}\"",
        ApiError.new("DUPLICATE_SINGLETON")
      )
    end
  end

  def fields
    item_type.fields
  end
end
