class UpsertItemType
  attr_reader :site, :attributes, :data, :item_type, :new_record,
    :ordering_field_data, :import_json

  def initialize(site, item_type, payload, import_json = false)
    @attributes = payload[:attributes]
    @ordering_field_data = payload[:relationships][:ordering_field][:data]
    @site = site
    @item_type = item_type
    @needs_to_reorder = (
      item_type.sortable != @attributes[:sortable] ||
        item_type.tree != @attributes[:tree]
    )
    @becomes_singleton = !item_type.singleton && @attributes[:singleton]
    @new_record = item_type.new_record?
    @import_json = import_json
  end

  def call
    params = attributes.slice(:name, :singleton, :sortable, :tree, :api_key)

    ActiveRecord::Base.transaction do
      item_type.update_attributes!(
        params.merge(ordering_attributes).merge(site: site)
      )
      manage_item_type_that_becomes_singleton!
      add_menu_item! if new_record && !import_json
    end

    if @needs_to_reorder
      reorder_items
    end
  rescue ActiveRecord::RecordInvalid => error
    raise InvalidRecordError.from_record_invalid(error)
  end

  def reorder_items
    ItemMigration::Reorder.new(item_type).call
  end

  private

  def ordering_attributes
    direction = attributes[:ordering_direction]

    if direction && !%w(asc desc).include?(direction)
      raise InvalidRecordError.new(
        "Invalid value",
        ApiError.new(
          "INVALID_FIELD",
          field: "ordering_direction",
          code: "INVALID_FORMAT"
        )
      )
    end

    if !!direction ^ !!ordering_field_data
      raise InvalidRecordError.new(
        "Both ordering_field and ordering_direction must be set",
        ApiError.new(
          "BOTH_ORDERING_FIELD_AND_ORDERING_DIRECTION_MUST_BE_SET"
        )
      )
    end

    if ordering_field_data && attributes[:singleton]
      raise InvalidRecordError.new(
        "Cannot set ordering field if item type is singleton",
        ApiError.new("SINGLETON_ITEM_TYPES_CANNOT_BE_ORDERED_BY_FIELD")
      )
    end

    if ordering_field_data && (attributes[:sortable] || attributes[:tree])
      raise InvalidRecordError.new(
        "Cannot set ordering field if item type is sortable/tree",
        ApiError.new("SORTABLE_ITEM_TYPES_CANNOT_BE_ORDERED_BY_FIELD")
      )
    end

    if ordering_field_data
      {
        ordering_field: item_type.fields.find(ordering_field_data[:id]),
        ordering_direction: direction
      }
    else
      {
        ordering_field: nil,
        ordering_direction: nil
      }
    end
  end

  def manage_item_type_that_becomes_singleton!
    return unless @becomes_singleton

    item_type.items.count <= 1 or
      raise InvalidRecordError.new(
      "Cannot convert to singleton!",
      ApiError.new(
        "INVALID_FIELD",
        field: "singleton",
        code: "MULTIPLE_INSTANCES_OF_SINGLETON"
      )
    )

    {
      link: "item_item_type",
      links: "items_item_type",
      rich_text: "rich_text_blocks"
    }.each do |field_type, validator_id|
      if any_fields_referencing_item_type?(field_type, validator_id)
        raise InvalidRecordError.new(
          "Item type is referenced in links/rich-text fields",
          ApiError.new(
            "INVALID_FIELD",
            field: "singleton",
            code: "SINGLETONS_CANNOT_BE_USED_AS_REFERENCE"
          )
        )
      end
    end

    item_type.update_attributes!(singleton_item: item_type.items.first)
  end

  def add_menu_item!
    return if site.menu_items.where(label: attributes[:name]).any?

    menu_item = MenuItem.new

    label = attributes[:name]

    payload = {
      data: {
        attributes: {
          label: label,
          position: 99
        },
        relationships: {
          parent: {
            data: nil
          },
          item_type: {
            data: {
              id: item_type.id.to_s,
              type: "item_type"
            }
          }
        }
      }
    }

    UpsertMenuItem.new(site, menu_item, payload).call
  end

  def any_fields_referencing_item_type?(field_type, validator_id)
    site.fields.where(field_type: field_type).find_each do |field|
      validators = field.validators
      ids = validators[validator_id].fetch("item_types", [])
      return true if ids.include?(item_type.id.to_s)
    end
  end
end
