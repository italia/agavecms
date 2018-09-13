class UpsertRole
  attr_reader :site, :data, :role

  def initialize(site, role, attributes)
    @data = attributes[:data].with_indifferent_access
    @site = site
    @role = role
  end

  def call
    ActiveRecord::Base.transaction do
      positive = data[:attributes].delete(:positive_item_type_permissions)
      negative = data[:attributes].delete(:negative_item_type_permissions)

      role.update_attributes!(data[:attributes])

      role.item_type_permissions.destroy_all

      add_item_type_permissions!(positive, true)
      add_item_type_permissions!(negative, false)
    end
  rescue ActiveRecord::RecordInvalid => error
    raise InvalidRecordError.from_record_invalid(error)
  end

  private

  def add_item_type_permissions!(permissions, positive)
    permissions.each do |permission|
      role.item_type_permissions.create!(
        item_type_id: permission[:item_type],
        action: permission[:action],
        positive_rule: positive
      )
    end
  end
end
