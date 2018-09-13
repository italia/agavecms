module Agave
  module FieldType
    class Slug < Base
      def self.validator_klasses
        [
          Validator::Length,
          Validator::Required,
          Validator::Unique
        ]
      end

      def self.appeareance_klass
        Appeareance::Slug
      end

      def searchable_keys
        ["."]
      end

      def load(value)
        return nil if value.nil?

        value.is_a?(::String) or
          raise Agave::FieldType::InvalidFormatError

        value =~ /^[a-z0-9_]+(?:\-[a-z0-9]+)*$/ or
          raise Agave::FieldType::InvalidFormatError

        value
      end
    end
  end
end
