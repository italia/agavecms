export default function generateEmptyRole() {
  return {
    type: 'role',
    attributes: {
      can_edit_schema: false,
      can_edit_site: false,
      can_manage_users: false,
      can_publish_to_production: false,
      can_manage_access_tokens: false,
      can_perform_site_search: false,
      can_edit_favicon: false,
      can_dump_data: false,
      can_import_and_export: false,
      positive_item_type_permissions: [
        { item_type: null, action: 'all' },
      ],
      negative_item_type_permissions: [],
    },
  }
}
