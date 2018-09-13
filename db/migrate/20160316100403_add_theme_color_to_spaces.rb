class AddThemeColorToSpaces < ActiveRecord::Migration[5.2]
  def change
    add_column :spaces, :theme_hue, :integer
  end
end
