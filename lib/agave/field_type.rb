module Agave
  module FieldType
    def self.all
      [
        FieldType::Boolean,
        FieldType::Date,
        FieldType::DateTime,
        FieldType::File,
        FieldType::Float,
        FieldType::Image,
        FieldType::Integer,
        FieldType::String,
        FieldType::Text,
        FieldType::LatLon,
        FieldType::Seo,
        FieldType::GlobalSeo,
        FieldType::Link,
        FieldType::Links,
        FieldType::Video,
        FieldType::Tokens,
        FieldType::Slug,
        FieldType::Gallery,
        FieldType::RichText,
        FieldType::Color,
        FieldType::Theme
      ]
    end

    def self.codes
      all.map(&:code).freeze
    end

    def self.with_code(code)
      all.detect do |field_type|
        field_type.code == code
      end
    end
  end
end
