require "agave/validator"

module Agave
  module FieldType
    class Base
      def self.code
        name.demodulize.underscore
      end

      def self.validator_klasses
        []
      end

      def self.appeareance_klass
        nil
      end

      attr_reader :validators, :field, :appeareance, :fields_cache

      def initialize(
        field,
        validators = {},
        appeareance = nil,
        fields_cache = []
      )
        @field = field
        @fields_cache = fields_cache
        generate_validators(validators)
        generate_appeareance(appeareance)
      end

      def searchable_keys
        []
      end

      def load(value)
        value
      end

      def dump(value, _item_uploads_cache = {})
        value
      end

      def normalize(value)
        dump(load(value))
      end

      def present_value(value)
        value
      end

      def valid_format?(value)
        load(value)
        [true, nil]
      rescue InvalidFormatError => error
        [false, error.errors]
      end

      def failing_validators(data, attribute_name, locale, item_id)
        value = load(data[attribute_name])

        validators.select do |validator|
          !validator.call(value, locale, item_id)
        end
      end

      private

      def generate_validators(validators_config)
        validators_config.is_a? Hash or
          raise ArgumentError, "validators must be an Hash"

        @validators = validators_config.map do |validator_code, options|
          validator_klass = Agave::Validator.with_code(validator_code)

          validator_klass or
          raise ArgumentError, "non-existing validator #{validator_code}"

          self.class.validator_klasses.include?(validator_klass) or
          raise ArgumentError,
            "#{validator_code} is not a validator " +
            "for a #{self.class.code} field"

          Validator.with_code(validator_code).new(field, options)
        end
      end

      def generate_appeareance(value)
        klass = self.class.appeareance_klass

        if klass.present? && !value.is_a?(Hash)
          raise ArgumentError, "appeareance must be an Hash"
        end

        if klass && value
          @appeareance = klass.new(field, value, fields_cache)
        end
      end

      def site
        item_type ? item_type.site : nil
      end

      def item_type
        field.item_type
      end
    end
  end
end
