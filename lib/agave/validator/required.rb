module Agave
  module Validator
    class Required < Base
      def call(value, _locale, _item_id)
        value.present?
      end
    end
  end
end
