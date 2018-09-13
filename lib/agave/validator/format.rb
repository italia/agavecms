require "active_model"
require "email_validator"

module Agave
  module Validator
    class Format < Base
      ALLOWED_SCHEMES = %w(http https)

      PREDEFINED_PATTERN_VALIDATORS = {
        "email" => lambda do |value|
          EmailValidator.valid? value
        end,
        "url" => lambda do |value|
          begin
            uri = Addressable::URI.parse(value)
            uri && uri.host && ALLOWED_SCHEMES.include?(uri.scheme)
          rescue Addressable::URI::InvalidURIError
            false
          end
        end
      }

      attribute :predefined_pattern, String
      attribute :custom_pattern, String

      validates :predefined_pattern, inclusion: {
        in: PREDEFINED_PATTERN_VALIDATORS.keys,
        allow_nil: true
      }
      validate :check_for_presence_of_predefined_or_custom_pattern
      validate :check_for_validity_of_custom_pattern

      def call(value, _locale, _item_id)
        if value.blank?
          return true
        end

        if custom_pattern
          Regexp.new(custom_pattern).match(value).present?
        else
          PREDEFINED_PATTERN_VALIDATORS[predefined_pattern].call(value)
        end
      end

      private

      def check_for_validity_of_custom_pattern
        if custom_pattern.present?
          begin
            Regexp.new(custom_pattern)
          rescue RegexpError
            errors.add(:custom_pattern, :invalid)
          end
        end
      end

      def check_for_presence_of_predefined_or_custom_pattern
        if predefined_pattern.blank? && custom_pattern.blank?
          errors.add(:predefined_pattern, :blank)
        end
      end
    end
  end
end
