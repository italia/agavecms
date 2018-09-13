class ItemType < ApplicationRecord
  RESERVED_API_KEYS = %w(
    id
    find
    site
    available_locales
    item_types
    single_instance_item_types
    collection_item_types
    items_of_type
  )

  belongs_to :site,
    inverse_of: :item_types

  belongs_to :singleton_item,
    class_name: "Item"

  has_many :fields,
    inverse_of: :item_type,
    dependent: :destroy

  has_many :items,
    inverse_of: :item_type,
    dependent: :destroy

  has_one :menu_item,
    inverse_of: :item_type,
    dependent: :nullify

  belongs_to :ordering_field,
    class_name: "Field",
    dependent: :destroy

  has_many :role_permissions,
    inverse_of: :item_type,
    class_name: "RoleItemTypePermission",
    dependent: :destroy

  validates :site, :name, :api_key,
    presence: true

  validates :name,
    uniqueness: { scope: :site_id }

  validates :api_key,
    uniqueness: { scope: :site_id },
    format: { with: /\A[a-z_0-9]+\z/ }

  validates :ordering_direction,
    inclusion: { in: %w(asc desc), allow_blank: true }

  validate :avoid_sortable_singletons
  validate :check_api_key_validity
  validate :avoid_ordering_field_without_direction
  validate :avoid_ordering_field_if_sortable
  validate :avoid_ordering_field_if_tree
  validate :avoid_ordering_field_if_singleton

  def title_field
    fields.where(field_type: "string").detect do |field|
      field.appeareance["type"] == "title"
    end
  end

  private

  def avoid_sortable_singletons
    if singleton && sortable
      errors.add(:sortable, :invalid)
    end
  end

  def check_api_key_validity
    if RESERVED_API_KEYS.include? api_key
      errors.add(:api_key, :reserved)
    end
    if api_key && api_key.singularize != api_key
      errors.add(:api_key, :plural)
    end
  end

  def avoid_ordering_field_if_sortable
    if sortable && ordering_field
      errors.add(:base, :invalid)
    end
  end

  def avoid_ordering_field_if_tree
    if tree && ordering_field
      errors.add(:base, :invalid)
    end
  end

  def avoid_ordering_field_if_singleton
    if singleton && ordering_field
      errors.add(:base, :invalid)
    end
  end

  def avoid_ordering_field_without_direction
    if !!ordering_field ^ !!ordering_field
      errors.add(:base, :invalid)
    end
  end
end
