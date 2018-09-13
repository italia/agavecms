require "virtus"
require "active_model"

module Agave
  module FieldType
    class Gallery < Base
      def self.validator_klasses
        [Validator::Size]
      end

      def load(value)
        value.is_a?(::Array) || value.nil? or
          raise Agave::FieldType::InvalidFormatError

        if value
          value.map do |inner|
            inner.is_a?(::Hash) or
              raise Agave::FieldType::InvalidFormatError

            obj_value = Image::Value.new(inner)

            obj_value.valid? or
              raise Agave::FieldType::InvalidFormatError

            JSON.load(obj_value.to_json)
          end
        else
          value
        end
      end

      def dump(item_upload_ids, item_uploads_cache = {})
        (item_upload_ids || []).map do |item_upload_id|

          item_upload = item_uploads_cache.fetch(
            item_upload_id,
            ItemUpload.find_by_id(item_upload_id)
          )

          if item_upload.nil?
            return []
          end

          upload = item_upload.upload

          {
            path: upload.path,
            format: upload.format,
            size: upload.size,
            alt: upload.alt,
            title: upload.title,
            width: upload.width,
            height: upload.height
          }
        end
      end
    end
  end
end
