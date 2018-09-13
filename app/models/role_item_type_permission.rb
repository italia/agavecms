class RoleItemTypePermission < ApplicationRecord
  belongs_to :role, inverse_of: :item_type_permissions
  belongs_to :item_type, inverse_of: :role_permissions

  validates :role, :action, presence: true
  validates :action, inclusion: { in: %w(all read update create delete) }

  scope :positive, ->() { where(positive_rule: true) }
  scope :negative, ->() { where(positive_rule: false) }
end
