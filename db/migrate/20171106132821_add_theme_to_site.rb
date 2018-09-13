class AddThemeToSite < ActiveRecord::Migration[5.2]
  def up
    add_column :sites, :theme, :jsonb, null: false, default: { foo: "bar" }

    Site.find_each do |site|
      theme_hue = site.theme_hue || 190
      site.update_attribute(
        :theme,
        Theme.from_hue(theme_hue).merge(logo: nil)
      )
    end

    change_column_default :sites, :theme, nil
    remove_column :sites, :theme_hue
  end
end
