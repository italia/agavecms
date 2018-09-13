module Agave
  module FieldType
    class InvalidFormatError < RuntimeError
      attr_reader :errors

      def initialize(message = nil, errors = nil)
        super(message)
        @errors = errors
      end
    end
  end
end
