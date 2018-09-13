class ItemTypeSerializer < ApplicationSerializer
  attributes :name, :singleton, :sortable, :api_key, :ordering_direction, :tree
  has_many :fields
  has_one :singleton_item
  has_one :ordering_field

  def ordering_field
    if !object.tree && !object.sortable && !object.singleton
      object.ordering_field
    end
  end

  def ordering_direction
    if ordering_field
      object.ordering_direction
    end
  end

  def fields
    object.fields.sort_by(&:position)
  end

  def singleton_item
    if
      scope &&
      scope.role.can_perform_action_on_item_type?(object.site, object, "read")

      object.singleton_item
    end
  end
end
