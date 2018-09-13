class AddLocalizedToField < ActiveRecord::Migration[5.2]
  def change
    add_column :fields, :localized, :boolean, default: false
  end
end
