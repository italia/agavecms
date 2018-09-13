class AddValidatorsToFields < ActiveRecord::Migration[5.2]
  def change
    add_column :fields, :validators, :json, null: false
  end
end
