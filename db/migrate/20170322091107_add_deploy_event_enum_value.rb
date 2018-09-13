class AddDeployEventEnumValue < ActiveRecord::Migration[5.2]
  self.disable_ddl_transaction!

  def change
    execute <<-SQL
      ALTER TYPE deploy_event_type
      ADD VALUE 'request_unprocessable'
      BEFORE 'request'
    SQL
  end
end
