require "virtus"
require "active_model"

module Agave
  module FieldType
    class Color < Base
      class Value
        include Virtus.value_object
        include ActiveModel::Validations

        attribute :red, Integer
        attribute :green, Integer
        attribute :blue, Integer
        attribute :alpha, Integer

        validates :red, :green, :blue, :alpha, presence: true
        validates :red, :green, :blue, :alpha, inclusion: { in: 0..255 }
      end

      def self.validator_klasses
        [Validator::Required]
      end

      def self.appeareance_klass
        Appeareance::Color
      end

      include LoadableFromValueObject
    end
  end
end
