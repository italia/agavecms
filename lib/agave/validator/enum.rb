module Agave
  module Validator
    class Enum < Base
      attribute :values, Array[String]
      validates :values, length: { minimum: 1 }

      def call(value, _locale, _item_id)
        return true if value.nil?

        values.include? value
      end
    end
  end
end
