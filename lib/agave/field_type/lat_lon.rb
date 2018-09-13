require "virtus"
require "active_model"

module Agave
  module FieldType
    class LatLon < Base
      class Value
        include Virtus.value_object
        include ActiveModel::Validations

        attribute :latitude, Float
        attribute :longitude, Float

        validates :latitude, :longitude, presence: true
      end

      def self.validator_klasses
        [Validator::Required]
      end

      include LoadableFromValueObject
    end
  end
end
