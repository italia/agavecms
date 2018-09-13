class DestroyItem
  attr_reader :item, :site

  def initialize(item)
    @item = item
    @site = item.item_type.site
  end

  def call
    ActiveRecord::Base.transaction do
      item.destroy!
      remove_associations!

      NotifySiteChange.new(site).call

      nested_items.each do |item|
        DestroyItemIfOrphan.new(item).call
      end

      item
    end
  end

  private

  def nested_items
    NestedItems.new(item).call
  end

  def remove_associations!
    errors = []

    site.item_types.find_each do |item_type|
      associated_items = ItemsAssociated.new(item, item_type).call
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
    RemoveAssociation.new(associated_item, item).call
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
end
