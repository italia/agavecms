class Role < ApplicationRecord
  belongs_to :site,
    inverse_of: :roles

  has_many :users,
    inverse_of: :role,
    dependent: :restrict_with_exception

  has_many :access_tokens,
    inverse_of: :role,
    dependent: :restrict_with_exception

  has_many :item_type_permissions,
    inverse_of: :role,
    class_name: "RoleItemTypePermission",
    dependent: :destroy

  validates :name, presence: true, uniqueness: { scope: :site_id }
  validates :site, presence: true

  class PermissionValue
    include Virtus.value_object

    attribute :item_type_id, Integer
    attribute :action, String

    def destructive_action?
      %w(all read update create delete).include?(action)
    end

    def item_types(site)
      if item_type_id
        [ItemType.find(item_type_id)]
      else
        site.item_types
      end
    end
  end

  class Value
    include Virtus.value_object

    attribute :site_id, Integer
    attribute :can_access_site, Boolean
    attribute :can_read_deploy_events, Boolean
    attribute :can_edit_site, Boolean
    attribute :can_edit_schema, Boolean
    attribute :can_edit_favicon, Boolean
    attribute :can_manage_users, Boolean
    attribute :can_manage_access_tokens, Boolean
    attribute :can_perform_site_search, Boolean
    attribute :can_publish_to_production, Boolean
    attribute :can_dump_data, Boolean
    attribute :can_import_and_export, Boolean

    attribute :positive_rules, Array[PermissionValue]
    attribute :negative_rules, Array[PermissionValue]

    def can_perform_action_on_some_type?(site, action)
      site.item_types.any? do |item_type|
        can_perform_action_on_item_type?(site, item_type, action)
      end
    end

    def can_perform_action_on_every_item_type?(site, action)
      site.item_types.all? do |item_type|
        can_perform_action_on_item_type?(site, item_type, action)
      end
    end

    def item_types_with_permitted_action(site, action)
      site.item_types.select do |item_type|
        can_perform_action_on_item_type?(site, item_type, action)
      end
    end

    def can_perform_action_on_item_type?(site, item_type, action)
      allowed_item_types_for_action(site, action).include?(item_type)
    end

    def allowed_item_types_for_action(site, action)
      allowed_item_types = []

      positive_rules_for_action(action).each do |rule|
        allowed_item_types += rule.item_types(site)
      end

      negative_rules_for_action(action).each do |rule|
        allowed_item_types -= rule.item_types(site)
      end

      allowed_item_types
    end

    def positive_rules_for_action(action)
      positive_rules.select do |rule|
        rule.action == action || rule.action == "all"
      end
    end

    def negative_rules_for_action(action)
      negative_rules.select do |rule|
        rule.action == action || rule.action == "all"
      end
    end
  end

  def to_value_object
    positive_rules = item_type_permissions.positive.map do |rule|
      PermissionValue.new(
        item_type_id: rule.item_type_id,
        action: rule.action
      )
    end

    negative_rules = item_type_permissions.negative.map do |rule|
      PermissionValue.new(
        item_type_id: rule.item_type_id,
        action: rule.action
      )
    end

    Value.new(
      site_id: site.id,
      can_read_deploy_events: true,
      can_edit_favicon: can_edit_favicon,
      can_access_site: true,
      can_edit_site: can_edit_site,
      can_edit_schema: can_edit_schema,
      can_manage_users: can_manage_users,
      can_manage_access_tokens: can_manage_access_tokens,
      can_perform_site_search: can_perform_site_search,
      can_publish_to_production: can_publish_to_production,
      can_dump_data: can_dump_data,
      can_import_and_export: can_import_and_export,
      positive_rules: positive_rules,
      negative_rules: negative_rules
    )
  end
end
