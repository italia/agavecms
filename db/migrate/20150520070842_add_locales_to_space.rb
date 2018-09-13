class AddLocalesToSpace < ActiveRecord::Migration[5.2]
  def change
    add_column :spaces, :locales, :string, array: true, null: false
  end
end
