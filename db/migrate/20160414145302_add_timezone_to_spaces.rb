class AddTimezoneToSpaces < ActiveRecord::Migration[5.2]
  def change
    add_column :spaces, :timezone, :string
  end
end
