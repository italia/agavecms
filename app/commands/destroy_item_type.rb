class DestroyItemType
  attr_reader :item_type, :site

  def initialize(item_type)
    @item_type = item_type
    @site = @item_type.site
  end

  def call
    ActiveRecord::Base.transaction do
      remove_menu_items!
      remove_associated_items!
      item_type.reload.destroy!
      remove_from_field_validators!("link", "item_item_type")
      remove_from_field_validators!("links", "items_item_type")
      remove_from_field_validators!("rich_text", "rich_text_blocks")
      notify_changes!
    end
  end

  private

  def remove_associated_items!
    return if item_type.items.empty?

    errors = []

    (site.item_types - [item_type]).each do |it|
      associated_items = ItemsAssociated.new(item_type.items, it).call
      associated_items.each do |associated_item|
        errors += remove_associations_in_item!(associated_item)
      end
    end

    if errors.any?
      raise InvalidRecordError.new(
        "invalid format #{errors.inspect}",
        errors
      )
    end
  end

  def remove_associations_in_item!(associated_item)
    RemoveAssociation.new(associated_item, item_type.items).call
    []
  rescue InvalidRecordError => e
    e.errors.map do |error|
      ApiError.new(
        "REQUIRED_BY_ASSOCIATION",
        item_id: associated_item.to_param,
        item_type_id: associated_item.item_type.to_param,
        field_label: error.details[:field_label],
        locale: error.details[:locale]
      )
    end
  end

  def notify_changes!
    NotifySiteChange.new(site).call
  end

  def remove_menu_items!
    site.menu_items.where(item_type_id: item_type).each do |menu_item|
      if menu_item.children.size.zero?
        DestroyMenuItem.new(menu_item).call
      end
    end
  end

  def remove_from_field_validators!(field_type, validator_id)
    site_fields.where(field_type: field_type).find_each do |field|
      validators = field.validators
      ids = validators[validator_id].fetch("item_types", [])
      if ids.include?(item_type.id.to_s)
        validators[validator_id]["item_types"].delete(item_type.id.to_s)
        field.update_attributes!(validators: validators)
      end
    end
  end

  def site_fields
    site.fields
  end
end
