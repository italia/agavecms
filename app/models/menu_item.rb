class MenuItem < ApplicationRecord
  include ActiveModel::Serialization
  belongs_to :site,
    inverse_of: :menu_items

  belongs_to :item_type,
    inverse_of: :menu_item

  belongs_to :parent,
    class_name: "MenuItem",
    foreign_key: :parent_id,
    inverse_of: :children

  has_many :children,
    class_name: "MenuItem",
    foreign_key: :parent_id,
    inverse_of: :parent,
    dependent: :nullify

  validates :site, :label, :position, presence: true

  validates :label, uniqueness: { scope: %i(site_id parent_id) }

  scope :roots, ->() { where(parent: nil) }

  scope :by_position, ->() { order(:position) }

  scope :with_positions_between, -> (min, max) {
    where("position >= ?", min).where("position <= ?", max)
  }

  scope :with_positions_gte, -> (value) {
    where("position >= ?", value)
  }

  # scope :without, -> (item) {
  #   where("id != ?", item.id)
  # }
end
