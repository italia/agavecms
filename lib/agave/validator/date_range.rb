module Agave
  module Validator
    class DateRange < Base
      attribute :min, String
      attribute :max, String

      validate :check_at_least_one_option_is_provided
      validate :check_iso8601
      validate :max_greater_then_min

      def call(value, _locale, _item_id)
        CHECKS.all? do |attr, check|
          attribute_value = send(attr)
          if attribute_value.nil?
            true
          elsif !value
            true
          else
            Date.parse(value).send(check, Date.parse(attribute_value))
          end
        end
      end

      private

      CHECKS = { min: :>=, max: :<= }.freeze

      def check_at_least_one_option_is_provided
        all_empty = CHECKS.keys.all? { |attr| send(attr).nil? }
        errors.add(:base, :at_least_one) if all_empty
      end

      def check_iso8601
        CHECKS.keys.each do |attr|
          next if send(attr).nil?
          if send(attr) !~ /[\d]{4}-[\d]{2}-[\d]{2}/
            errors.add(:base, :invalid_format)
          end
        end
      end

      def max_greater_then_min
        if max && min && max < min
          errors.add(:base, :invalid_range)
        end
      end
    end
  end
end
