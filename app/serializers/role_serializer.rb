class RoleSerializer < ApplicationSerializer
  attributes :name
  attributes :can_edit_schema, :can_edit_site, :can_edit_favicon
  attributes :can_manage_users
  attributes :can_manage_access_tokens
  attributes :can_perform_site_search
  attributes :can_publish_to_production
  attributes :can_dump_data
  attributes :can_import_and_export
  attributes :positive_item_type_permissions
  attributes :negative_item_type_permissions

  def negative_item_type_permissions
    object.item_type_permissions.where(positive_rule: false).map do |permission|
      {
        item_type: permission.item_type_id.to_s,
        action: permission.action
      }
    end
  end

  def positive_item_type_permissions
    object.item_type_permissions.where(positive_rule: true).map do |permission|
      {
        item_type: permission.item_type_id.to_s,
        action: permission.action
      }
    end
  end
end
