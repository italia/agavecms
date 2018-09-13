require "virtus"
require "active_model"

module Agave
  module Appeareance
    class Base
      include Virtus.value_object
      include ActiveModel::Validations

      attr_reader :field, :fields_cache

      def initialize(field, config = {}, fields_cache = [])
        config.is_a? Hash or
          raise ArgumentError, "config must be an Hash"

        super(config)

        @field = field
        @fields_cache = fields_cache

        validate_attributes!

        config.deep_stringify_keys == attributes.deep_stringify_keys or
          raise ArgumentError, "extra attributes provided"
      end

      private

      def validate_attributes!
        unless valid?
          raise ArgumentError, [
            "invalid appeareance config:",
            attributes.inspect,
            errors.full_messages
          ].join(" ")
        end
      end
    end
  end
end
