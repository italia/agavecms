require "virtus"
require "active_model"

module Agave
  module FieldType
    class Link < Base
      def self.validator_klasses
        [
          Validator::Required,
          Validator::ItemItemType
        ]
      end

      def self.appeareance_klass
        Appeareance::Link
      end

      def load(value)
        value.is_a?(::String) || value.nil? or
          raise Agave::FieldType::InvalidFormatError

        if value
          site.item_by_id(value) or
            raise Agave::FieldType::InvalidFormatError
        end

        value
      end
    end
  end
end
