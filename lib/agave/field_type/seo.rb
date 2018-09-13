require "virtus"
require "active_model"

module Agave
  module FieldType
    class Seo < Base
      class Value
        include Virtus.value_object
        include ActiveModel::Validations

        attribute :title, String
        attribute :description, String
        attribute :image, Agave::FieldType::Image::Value

        validates :title, :description, presence: true
        validates :title, length: { maximum: 65 }
        validates :description, length: { maximum: 160 }

        validate :check_image_min_size

        private

        def check_image_min_size
          return unless image
          image.valid? or errors.add(:image, :invalid)
        end
      end

      def self.validator_klasses
        [
          Validator::Required
        ]
      end

      include LoadableFromValueObject

      def dump(hash, item_uploads_cache = {})
        if !hash || !hash["image"]
          hash
        else

          item_upload = item_uploads_cache.fetch(
            hash["image"].to_i,
            ItemUpload.find_by_id(hash["image"])
          )

          if item_upload.nil?
            return hash.merge("image": nil)
          end

          upload = item_upload.upload

          hash.merge(
            "image": {
              path: upload.path,
              format: upload.format,
              size: upload.size,
              alt: upload.alt,
              title: upload.title,
              width: upload.width,
              height: upload.height
            }
          )
        end
      end
    end
  end
end
