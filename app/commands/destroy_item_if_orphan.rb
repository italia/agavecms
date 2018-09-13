class DestroyItemIfOrphan
  attr_reader :item

  def initialize(item)
    @item = item
  end

  def call
    if no_menu_item? && !linked_to_anything?
      DestroyItem.new(item).call
      true
    end
  end

  private

  def no_menu_item?
    !site.menu_items.where(item_type: item.item_type).any?
  end

  def linked_to_anything?
    site.item_types.find_each do |item_type|
      if ItemsAssociated.new(item, item_type).call.any?
        return true
      end
    end

    false
  end

  def site
    item.item_type.site
  end
end
