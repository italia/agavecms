require "virtus"
require "active_model"

module Agave
  module Validator
    class Base
      include Virtus.value_object
      include ActiveModel::Validations

      attr_reader :field

      def initialize(field, config = {})
        @field = field

        config.is_a? Hash or
          raise ArgumentError, "config must be an Hash"

        super(config)

        validate_attributes!

        config_keys = Set.new(config.keys.map(&:to_s))
        attributes_keys = Set.new(attributes.keys.map(&:to_s))

        unless config_keys.subset?(attributes_keys)
          invalid_keys = (config_keys - attributes_keys).to_a

          raise ArgumentError,
            "extra attributes provided: #{invalid_keys.join(', ')}"
        end
      end

      def self.code
        name.demodulize.underscore
      end

      def call(_value, _locale, _item_id)
        raise "not implemented!"
      end

      private

      def item_type
        field.item_type
      end

      def site
        item_type.site
      end

      def validate_attributes!
        unless valid?
          raise ArgumentError, [
            "invalid validator config:",
            attributes.inspect,
            errors.full_messages
          ].join(" ")
        end
      end
    end
  end
end
