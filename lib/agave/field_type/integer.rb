module Agave
  module FieldType
    class Integer < Base
      def self.validator_klasses
        [
          Validator::Required,
          Validator::NumberRange
        ]
      end

      def load(value)
        valid_integer = begin
                          !!Integer(value.to_s)
                        rescue
                          false
                        end

        valid_integer || value.blank? or
          raise Agave::FieldType::InvalidFormatError

        value.blank? ? nil : Integer(value)
      end
    end
  end
end
