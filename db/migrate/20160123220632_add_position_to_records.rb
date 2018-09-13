class AddPositionToRecords < ActiveRecord::Migration[5.2]
  def change
    add_column :records, :position, :integer
    add_column :content_types, :sortable, :boolean,
      null: false, default: false
  end
end
