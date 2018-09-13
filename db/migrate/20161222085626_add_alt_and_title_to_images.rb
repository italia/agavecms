class AddAltAndTitleToImages < ActiveRecord::Migration[5.2]
  def change
    ItemType.find_each do |item_type|
      image_fields = item_type.fields.where(field_type: "image")
      if image_fields.any?
        item_type.items.each do |item|
          data = item.data
          image_fields.each do |field|
            field_id = field.id.to_s
            if data[field_id].is_a?(Hash) && !data[field_id].has_key?("path")
              data[field_id] = Hash[
                data[field_id].map do |locale, hash|
                  if hash
                    [locale, hash.merge!(alt: nil, title: nil)]
                  else
                    [locale, hash]
                  end
                end
              ]
            elsif data[field_id]
              data[field_id].merge!(alt: nil, title: nil)
            end
          end
          item.update_attributes!(data: data)
        end
      end
    end
  end
end
