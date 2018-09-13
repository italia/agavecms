class DestroyMenuItem
  attr_reader :menu_item, :site

  def initialize(menu_item)
    @menu_item = menu_item
    @site = menu_item.site
  end

  def call
    ActiveRecord::Base.transaction do
      children = menu_item.children.by_position.to_a
      menu_item.destroy!
      starting_position = next_available_position
      children.each_with_index do |menu_item, i|
        menu_item.update_attributes(
          parent: nil,
          position: starting_position + i
        )
      end
    end
  end

  def next_available_position
    max_position = site.menu_items.roots.maximum(:position) || 0
    max_position + 1
  end
end
