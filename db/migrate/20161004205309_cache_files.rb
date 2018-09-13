class CacheFiles < ActiveRecord::Migration[5.2]
  def change
    add_reference :site_files, :item,
      index: true,
      null: false,
      foreign_key: true,
      on_delete: :cascade

    remove_foreign_key :deploy_events, :sites
    add_foreign_key :deploy_events, :sites, on_delete: :cascade
  end
end
