module Agave
  module Validator
    class Size < Base
      attribute :min, Integer
      attribute :max, Integer
      attribute :eq, Integer

      validate :check_at_least_one_option_is_provided

      def call(value, _locale, _item_id)
        CHECKS.all? do |attr, check|
          attribute_value = send(attr)
          if attribute_value.nil?
            true
          elsif value.is_a? Array
            value.size.send(check, attribute_value)
          else
            value.to_s.size.send(check, attribute_value)
          end
        end
      end

      private

      CHECKS = { min: :>=, max: :<=, eq: :== }.freeze

      def check_at_least_one_option_is_provided
        all_empty = CHECKS.keys.all? { |attr| send(attr).nil? }
        errors.add(:base, :at_least_one) if all_empty
      end
    end
  end
end
