module Agave
  module Validator
    class ItemItemType < Base
      attribute :item_types
      validate :check_item_types_exists

      def call(id_or_nil, _locale, _item_id)
        return true if id_or_nil.nil?
        return false unless id_or_nil.is_a? String

        item = site.item_by_id(id_or_nil)

        if item.nil?
          false
        else
          item_type_objects.include?(item.item_type)
        end
      end

      private

      def item_type_objects
        @item_type_objects ||= item_types.map do |id|
          site.item_type_by_id(id)
        end
      end

      def check_item_types_exists
        if item_types.is_a? Array
          item_types.all? { |id| id.is_a? String } or
            errors.add(:item_types, :array)

          item_type_objects.all?(&:present?) or
            errors.add(:item_types, :invalid)
        else
          errors.add(:item_types, :array)
        end
      end
    end
  end
end
