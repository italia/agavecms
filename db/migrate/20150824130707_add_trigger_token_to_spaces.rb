class AddTriggerTokenToSpaces < ActiveRecord::Migration[5.2]
  def change
    add_column :spaces, :trigger_token, :string
  end
end
