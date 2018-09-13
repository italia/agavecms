class AddSingletonToContentTypes < ActiveRecord::Migration[5.2]
  def change
    add_column :content_types, :singleton, :boolean, default: false
  end
end
