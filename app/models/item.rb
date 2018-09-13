class Item < ApplicationRecord

  belongs_to :item_type,
    inverse_of: :items

  belongs_to :parent,
    class_name: "Item",
    inverse_of: :children

  has_many :children,
    class_name: "Item",
    foreign_key: :parent_id,
    inverse_of: :parent,
    dependent: :nullify

  has_many :item_uploads, dependent: :destroy

  has_many :uploads,
    inverse_of: :site,
    through: :item_uploads

  validates :item_type, presence: true
  validates :position, presence: true, if: :sortable_item_type?

  scope :with_positions_between, -> (min, max) {
    where("position >= ?", min).where("position <= ?", max)
  }

  scope :with_positions_gte, -> (value) {
    where("position >= ?", value)
  }

  scope :children_of, -> (parent_id) {
    if parent_id
      where("parent_id = ?", parent_id)
    else
      where("parent_id IS NULL")
    end
  }

  # scope :without, -> (item) {
  #   where("items.id != ?", item.id)
  # }

  def site
    item_type.site
  end

  private

  def sortable_item_type?
    item_type && item_type.sortable
  end
end
