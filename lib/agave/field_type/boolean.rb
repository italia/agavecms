module Agave
  module FieldType
    class Boolean < Base
      def load(value)
        unless [TrueClass, FalseClass, NilClass].include?(value.class)
          raise Agave::FieldType::InvalidFormatError
        end

        !!value
      end
    end
  end
end
