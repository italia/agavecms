module Agave
  module FieldType
    module LoadableFromValueObject
      def load(value)
        return nil if value.nil?
        value.is_a? Hash or raise Agave::FieldType::InvalidFormatError
        load_hash(value)
      end

      def load_hash(value)
        obj_value = self.class.const_get("Value").new(value)

        obj_value.valid? or raise Agave::FieldType::InvalidFormatError.new(
          [
            "invalid attributes for type #{self.class.code}:",
            obj_value.attributes,
            "errors:",
            obj_value.errors.messages
          ].join(" "),
          obj_value.errors.messages
        )

        JSON.load(obj_value.to_json)
      end
    end
  end
end
