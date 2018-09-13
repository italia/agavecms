class AddPermissionsToUsers < ActiveRecord::Migration[5.2]
  def up
    create_table :roles do |t|
      t.references :site, null: false
      t.string :name, null: false
      t.boolean :can_edit_site, null: false, default: false
      t.boolean :can_edit_schema, null: false, default: false
      t.boolean :can_manage_users, null: false, default: false
      t.boolean :can_publish_to_production, null: false, default: false
      t.boolean :can_edit_favicon, null: false, default: false
    end
    add_index :roles, [:name, :site_id], unique: true

    add_reference :users, :role
    add_foreign_key :users, :roles, on_delete: :restrict
    add_foreign_key :roles, :sites, on_delete: :cascade

    execute "CREATE TYPE role_action AS ENUM ('all', 'read', 'update', 'create', 'delete');"

    create_table :role_item_type_permissions do |t|
      t.references :role, null: false
      t.references :item_type
      t.column :action, :role_action, null: false
      t.column :positive_rule, :boolean, default: true, null: false
    end
    add_foreign_key :role_item_type_permissions, :roles, on_delete: :cascade
    add_foreign_key :role_item_type_permissions, :item_types, on_delete: :cascade
  end

  def down
    remove_reference :users, :role
    drop_table :role_item_type_permissions
    execute "DROP TYPE role_action;"
    drop_table :roles
  end
end
