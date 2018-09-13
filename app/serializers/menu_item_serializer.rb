class MenuItemSerializer < ApplicationSerializer
  attributes :label, :position
  has_one :item_type
  has_one :parent
  has_many :children
end
