class AddValidatedToRecords < ActiveRecord::Migration[5.2]
  def change
    add_column :records, :validated, :boolean, null: false, default: false
  end
end
