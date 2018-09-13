class CreateDeployEvents < ActiveRecord::Migration[5.2]
  def up
    execute <<-SQL
      CREATE TYPE deploy_event_type
      AS ENUM (
        'request', 'request_failed',
        'response_success', 'response_failure',
        'response_timeout', 'request_aborted'
      );
    SQL

    create_table :deploy_events do |t|
      t.references :site, index: true, foreign_key: true, null: false
      t.jsonb :data
      t.timestamps null: false
    end

    add_column :deploy_events, :event_type, :deploy_event_type
  end

  def down
    drop_table :deploy_events
    execute "DROP TYPE deploy_event_type"
  end
end
