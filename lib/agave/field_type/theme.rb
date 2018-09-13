require "virtus"
require "active_model"

module Agave
  module FieldType
    class Theme < Base
      class Value
        include Virtus.value_object
        include ActiveModel::Validations

        attribute :primary_color, Agave::FieldType::Color::Value
        attribute :accent_color, Agave::FieldType::Color::Value
        attribute :light_color, Agave::FieldType::Color::Value
        attribute :dark_color, Agave::FieldType::Color::Value
        attribute :logo, Agave::FieldType::Image::Value

        validates :primary_color, :accent_color, :light_color, :dark_color,
          presence: true
      end

      include LoadableFromValueObject
    end
  end
end
