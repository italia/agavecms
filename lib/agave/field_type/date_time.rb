module Agave
  module FieldType
    class DateTime < Base
      def self.validator_klasses
        [
          Validator::Required
        ]
      end

      def load(value)
        return nil if value.nil?

        value = value.to_s

        begin
          ::DateTime.iso8601(value).
            strftime("%a, %d %b %Y %H:%M:%S").
            to_datetime.
            iso8601

        rescue ArgumentError
          raise Agave::FieldType::InvalidFormatError
        end
      end

      def dump(value, _item_uploads_cache = {})
        if value
          ActiveSupport::TimeZone[site.timezone].
            parse(Time.parse(value).asctime).iso8601
        end
      end
    end
  end
end
