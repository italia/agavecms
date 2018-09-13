class RemovePositionFromContentTypes < ActiveRecord::Migration[5.2]
  def change
    remove_column :content_types, :position, :integer, default: 999
  end
end
