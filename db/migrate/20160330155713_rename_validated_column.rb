class RenameValidatedColumn < ActiveRecord::Migration[5.2]
  def change
    rename_column :records, :validated, :is_valid
  end
end
