module Agave
  module FieldType
    class String < Text
      def self.validator_klasses
        [
          Validator::Length,
          Validator::Enum,
          Validator::Format,
          Validator::Required,
          Validator::Unique
        ]
      end

      def self.appeareance_klass
        Appeareance::String
      end

      def searchable_keys
        ["."]
      end
    end
  end
end
