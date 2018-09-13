module Agave
  module Validator
    class Unique < Base
      def call(value_or_nil, locale, item_id)
        return true if value_or_nil.blank?

        scope = item_type.items

        if item_id
          scope = scope.where("items.id <> ?", item_id)
        end

        items = ItemFieldSearch.new(scope, field, value_or_nil, locale).call

        items.count == 0
      end
    end
  end
end
