require "virtus"
require "active_model"

module Agave
  module FieldType
    class Links < Base
      def self.validator_klasses
        [
          Validator::Size,
          Validator::ItemsItemType
        ]
      end

      def self.appeareance_klass
        Appeareance::Link
      end

      def load(value)
        value.is_a?(::Array) || value.nil? or
          raise Agave::FieldType::InvalidFormatError

        if value
          value.each do |inner|
            inner.is_a?(::String) && site.item_by_id(inner) or
              raise Agave::FieldType::InvalidFormatError
            inner
          end
        end

        value
      end

      def dump(value, _item_uploads_cache = {})
        value ? value : []
      end
    end
  end
end
