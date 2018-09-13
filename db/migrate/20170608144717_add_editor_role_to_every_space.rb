class AddEditorRoleToEverySpace < ActiveRecord::Migration[5.2]
  def up
    Site.all.find_each do |site|
      editor_role = site.roles.create!(
        name: "Editor",
        can_edit_site: false,
        can_edit_schema: false,
        can_manage_users: false,
        can_publish_to_production: true,
        can_edit_favicon: true
      )

      editor_role.item_type_permissions.create!(
        action: "all",
        positive_rule: true
      )

      admin_role = site.roles.create!(
        name: "Admin",
        can_edit_site: true,
        can_edit_schema: true,
        can_manage_users: true,
        can_publish_to_production: true,
        can_edit_favicon: true
      )

      admin_role.item_type_permissions.create!(
        action: "all",
        positive_rule: true
      )

      site.users.find_each do |user|
        user.update_attributes!(role: editor_role)
      end

      print "."
    end
  end

  def down
  end
end
