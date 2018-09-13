require "virtus"
require "active_model"

module Agave
  module FieldType
    class Video < Base
      class Value
        include Virtus.value_object
        include ActiveModel::Validations

        attribute :url, String
        attribute :width, Integer
        attribute :height, Integer
        attribute :thumbnail_url, String
        attribute :title, Integer
        attribute :provider, String
        attribute :provider_uid, String

        validates :url, :width, :height, :thumbnail_url, :title,
          :provider, :provider_uid, presence: true

        validates :provider, inclusion: %w(youtube vimeo)
      end

      def self.validator_klasses
        [Validator::Required]
      end

      include LoadableFromValueObject
    end
  end
end
