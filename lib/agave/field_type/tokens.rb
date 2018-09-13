module Agave
  module FieldType
    class Tokens < Base
      def self.validator_klasses
        [
          Validator::Size,
          Validator::Required
        ]
      end

      def searchable_keys
        []
      end

      def load(value)
        value.is_a?(::Array) || value.nil? or
          raise Agave::FieldType::InvalidFormatError

        value.all? { |v| v.is_a?(::String) } or
          raise Agave::FieldType::InvalidFormatError

        value
      end
    end
  end
end
