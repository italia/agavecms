module Agave
  module FieldType
    class Float < Base
      def self.validator_klasses
        [
          Validator::Required,
          Validator::NumberRange
        ]
      end

      def load(value)
        valid_float = begin
                        !!Float(value)
                      rescue
                        false
                      end

        valid_float || value.blank? or
          raise Agave::FieldType::InvalidFormatError

        value.blank? ? nil : Float(value)
      end
    end
  end
end
