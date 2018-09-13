require "virtus"
require "active_model"

module Agave
  module FieldType
    class File < Base
      class Value
        include Virtus.value_object
        include ActiveModel::Validations

        attribute :path, String
        attribute :format, String
        attribute :size, Integer

        validates :path, :format, :size, presence: true

        def format
          super ? super.downcase : nil
        end
      end

      def self.validator_klasses
        [
          Validator::Required,
          Validator::FileSize,
          Validator::Extension
        ]
      end

      include LoadableFromValueObject

      def dump(item_upload_id, item_uploads_cache = {})
        if item_upload_id

          item_upload = item_uploads_cache.fetch(
            item_upload_id,
            ItemUpload.find_by_id(item_upload_id)
          )

          if item_upload.nil?
            return nil
          end

          upload = item_upload.upload

          {
            path: upload.path,
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
