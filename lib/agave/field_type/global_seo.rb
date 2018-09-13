require "virtus"
require "active_model"
require "validate_url"

module Agave
  module FieldType
    class GlobalSeo < Base
      class Value
        include Virtus.value_object
        include ActiveModel::Validations

        attribute :site_name, String
        attribute :title_suffix, String
        attribute :twitter_account, String
        attribute :facebook_page_url, String
        attribute :fallback_seo, Agave::FieldType::Seo::Value

        validates :site_name, :fallback_seo, presence: true
        validates :title_suffix, length: { maximum: 25 }
        validates :facebook_page_url, url: { allow_blank: true }

        validate :check_fallback_seo_validity

        def twitter_account
          value = super
          if value.present?
            value = "@" + value unless value =~ /^@/
            value
          end
        end

        private

        def check_fallback_seo_validity
          return unless fallback_seo
          fallback_seo.valid? or errors.add(:fallback_seo, :invalid)
        end
      end

      include LoadableFromValueObject
    end
  end
end
