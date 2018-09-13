require "virtus"
require "active_model"

module Agave
  module FieldType
    class Image < Base
      class Value
        include Virtus.value_object
        include ActiveModel::Validations

        attribute :path, String
        attribute :width, Integer
        attribute :height, Integer
        attribute :format, String
        attribute :size, Integer
        attribute :alt, String
        attribute :title, String

        validates :path, :format, :size, presence: true
        validates :format, inclusion: %w(png jpg jpeg gif svg)
        validates :width, :height, presence: true, unless: :svg?

        def svg?
          format == "svg"
        end

        def format
          super ? super.downcase : nil
        end
      end

      def self.validator_klasses
        [
          Validator::Required,
          Validator::FileSize
        ]
      end

      include LoadableFromValueObject

      def dump(item_upload_id, item_uploads_cache = {})
        if item_upload_id
          item_upload = item_uploads_cache.fetch(
            item_upload_id.to_i,
            ItemUpload.find_by_id(item_upload_id)
          )

          if item_upload.nil?
            return nil
          end

          upload = item_upload.upload

          {
            path: upload.path,
            width: upload.width,
            height: upload.height,
            format: upload.format,
            size: upload.size,
            alt: upload.alt,
            title: upload.title
          }
        end
      end
    end
  end
end
