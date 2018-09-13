class AddConfigToFields < ActiveRecord::Migration[5.2]
  def change
    add_column :fields, :appeareance, :json
  end
end
