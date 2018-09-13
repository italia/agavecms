module Agave
  module FieldType
    class Date < Base
      def self.validator_klasses
        [
          Validator::Required,
          Validator::DateRange
        ]
      end

      def load(value)
        return nil if value.blank?

        value = value.to_s

        begin
          ::Date.iso8601(value.to_s).iso8601
        rescue ArgumentError
          raise Agave::FieldType::InvalidFormatError
        end
      end
    end
  end
end
