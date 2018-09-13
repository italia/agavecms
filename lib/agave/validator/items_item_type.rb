module Agave
  module Validator
    class ItemsItemType < ItemItemType
      def call(ids_or_nil, _locale, _item_id)
        return true if ids_or_nil.nil?
        return false unless ids_or_nil.is_a? Array

        items = ids_or_nil.map do |id|
          site.item_by_id(id)
        end

        if items.any?(&:nil?)
          false
        else
          items.all? do |item|
            item_type_objects.include?(item.item_type)
          end
        end
      end
    end
  end
end
