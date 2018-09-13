module Agave
  module Validator
    class RichTextBlocks < ItemsItemType
      validate :check_item_types_is_not_singleton

      private

      def check_item_types_is_not_singleton
        if item_types.is_a? Array
          item_type_objects.all? { |it| it && !it.singleton } or
            errors.add(:item_types, :invalid)
        end
      end
    end
  end
end
