module Agave
  module FieldType
    class Text < Base
      def self.validator_klasses
        [
          Validator::Length,
          Validator::Required,
          Validator::Format
        ]
      end

      def self.appeareance_klass
        Appeareance::Text
      end

      def load(value)
        value.is_a?(::String) || value.nil? or
          raise Agave::FieldType::InvalidFormatError

        value
      end

      def searchable_keys
        ["."]
      end
    end
  end
end
