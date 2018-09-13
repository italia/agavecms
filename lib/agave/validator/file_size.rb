require "filesize"

module Agave
  module Validator
    class FileSize < Base
      UNITS = %w(KB MB)
      UNITS_CONVERSION = { "KB" => "KiB", "MB" => "MiB" }

      attribute :min_value, Integer
      attribute :max_value, Integer

      attribute :min_unit, Integer
      attribute :max_unit, Integer

      validates :min_unit, inclusion: { in: UNITS, allow_nil: true }
      validates :max_unit, inclusion: { in: UNITS, allow_nil: true }

      validate :check_at_least_one_option_is_provided
      validate :check_options_and_values_are_provided

      def call(value, _locale, _item_id)
        CHECKS.all? do |attr, check_method|
          attribute_value = send("#{attr}_value")
          attribute_unit = send("#{attr}_unit")

          if attribute_value.nil?
            true
          elsif value.nil?
            true
          else
            unit_convertion = UNITS_CONVERSION[attribute_unit]
            size_string = "#{attribute_value} #{unit_convertion}"
            bytes = Filesize.from(size_string).to_f("B")
            value["size"].send(check_method, bytes)
          end
        end
      end

      private

      CHECKS = { min: :>=, max: :<= }.freeze
      ATTRS = CHECKS.keys

      def check_at_least_one_option_is_provided
        all_empty = ATTRS.all? { |attr| send("#{attr}_value").nil? }
        errors.add(:base, :at_least_one_value) if all_empty
      end

      def check_options_and_values_are_provided
        all_units_filled = ATTRS.all? do |attr|
          value = send("#{attr}_value").nil?
          unit = send("#{attr}_unit").nil?
          (value && unit) || (!value && !unit)
        end
        errors.add(:base, :missing_units) unless all_units_filled
      end
    end
  end
end
