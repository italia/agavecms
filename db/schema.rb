# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_10_08_140322) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "hstore"
  enable_extension "plpgsql"

  create_table "access_tokens", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "site_id", null: false
    t.bigint "role_id"
    t.string "hardcoded_type"
    t.string "token", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["role_id"], name: "index_access_tokens_on_role_id"
    t.index ["site_id", "name"], name: "index_access_tokens_on_site_id_and_name", unique: true
    t.index ["site_id"], name: "index_access_tokens_on_site_id"
    t.index ["token"], name: "index_access_tokens_on_token", unique: true
  end

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer "priority", default: 0, null: false
    t.integer "attempts", default: 0, null: false
    t.text "handler", null: false
    t.text "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by"
    t.string "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["priority", "run_at"], name: "delayed_jobs_priority"
  end

# Could not dump table "deploy_events" because of following StandardError
#   Unknown type 'deploy_event_type' for column 'event_type'

  create_table "environments", force: :cascade do |t|
    t.bigint "site_id", null: false
    t.string "git_repo_url"
    t.string "frontend_url"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "deploy_status"
    t.string "deploy_adapter"
    t.json "deploy_settings", default: {}
    t.index ["site_id"], name: "index_environments_on_site_id"
  end

  create_table "fields", force: :cascade do |t|
    t.bigint "item_type_id", null: false
    t.string "label", null: false
    t.string "api_key", null: false
    t.string "hint"
    t.string "field_type", null: false
    t.integer "position", default: 999
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.json "validators", null: false
    t.boolean "localized", default: false
    t.json "appeareance"
    t.index ["item_type_id", "api_key"], name: "index_fields_on_item_type_id_and_api_key", unique: true
    t.index ["item_type_id", "label"], name: "index_fields_on_item_type_id_and_label", unique: true
    t.index ["item_type_id"], name: "index_fields_on_item_type_id"
  end

# Could not dump table "item_types" because of following StandardError
#   Unknown type 'order_direction' for column 'ordering_direction'

  create_table "item_uploads", force: :cascade do |t|
    t.bigint "field_id", null: false
    t.bigint "item_id", null: false
    t.string "locale"
    t.string "upload_path"
    t.index ["field_id"], name: "index_item_uploads_on_field_id"
    t.index ["item_id"], name: "index_item_uploads_on_item_id"
    t.index ["upload_path"], name: "index_item_uploads_on_upload_path"
  end

  create_table "items", force: :cascade do |t|
    t.bigint "item_type_id", null: false
    t.jsonb "data", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "position"
    t.boolean "is_valid", default: false, null: false
    t.integer "parent_id"
    t.index ["item_type_id"], name: "index_items_on_item_type_id"
  end

  create_table "menu_items", force: :cascade do |t|
    t.bigint "site_id", null: false
    t.integer "parent_id"
    t.string "label", null: false
    t.bigint "item_type_id"
    t.integer "position", default: 99, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_type_id"], name: "index_menu_items_on_item_type_id"
    t.index ["site_id", "label", "parent_id"], name: "index_menu_items_on_site_id_and_label_and_parent_id", unique: true
    t.index ["site_id"], name: "index_menu_items_on_site_id"
  end

# Could not dump table "role_item_type_permissions" because of following StandardError
#   Unknown type 'role_action' for column 'action'

  create_table "roles", force: :cascade do |t|
    t.bigint "site_id", null: false
    t.string "name", null: false
    t.boolean "can_edit_site", default: false, null: false
    t.boolean "can_edit_schema", default: false, null: false
    t.boolean "can_manage_users", default: false, null: false
    t.boolean "can_publish_to_production", default: false, null: false
    t.boolean "can_edit_favicon", default: false, null: false
    t.boolean "can_manage_access_tokens", default: false, null: false
    t.boolean "can_perform_site_search", default: false, null: false
    t.boolean "can_dump_data", default: false, null: false
    t.boolean "can_import_and_export", default: false, null: false
    t.index ["name", "site_id"], name: "index_roles_on_name_and_site_id", unique: true
    t.index ["site_id"], name: "index_roles_on_site_id"
  end

# Could not dump table "sites" because of following StandardError
#   Unknown type 'deploy_status' for column 'production_deploy_status'

  create_table "uploads", primary_key: "path", id: :string, force: :cascade do |t|
    t.bigint "site_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "size", null: false
    t.integer "width"
    t.integer "height"
    t.string "format"
    t.string "alt"
    t.string "title"
    t.text "attachment_data"
    t.index ["site_id"], name: "index_uploads_on_site_id"
  end

  create_table "users", force: :cascade do |t|
    t.bigint "site_id"
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "email", null: false
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "invite_token"
    t.string "password_reset_token"
    t.bigint "role_id"
    t.boolean "check_policy", default: false, null: false
    t.index ["role_id"], name: "index_users_on_role_id"
    t.index ["site_id", "email"], name: "index_users_on_site_id_and_email", unique: true
    t.index ["site_id"], name: "index_users_on_site_id"
  end

  add_foreign_key "access_tokens", "roles"
  add_foreign_key "access_tokens", "sites"
  add_foreign_key "deploy_events", "environments"
  add_foreign_key "deploy_events", "sites", on_delete: :cascade
  add_foreign_key "environments", "sites"
  add_foreign_key "fields", "item_types", on_delete: :cascade
  add_foreign_key "item_types", "fields", column: "ordering_field_id", on_delete: :cascade
  add_foreign_key "item_types", "sites", on_delete: :cascade
  add_foreign_key "item_uploads", "fields"
  add_foreign_key "item_uploads", "items"
  add_foreign_key "items", "item_types", on_delete: :cascade
  add_foreign_key "items", "items", column: "parent_id", on_delete: :nullify
  add_foreign_key "menu_items", "item_types", on_delete: :nullify
  add_foreign_key "menu_items", "sites", on_delete: :cascade
  add_foreign_key "role_item_type_permissions", "item_types", on_delete: :cascade
  add_foreign_key "role_item_type_permissions", "roles", on_delete: :cascade
  add_foreign_key "roles", "sites", on_delete: :cascade
  add_foreign_key "uploads", "sites"
  add_foreign_key "users", "roles", on_delete: :restrict
  add_foreign_key "users", "sites", on_delete: :cascade
end
