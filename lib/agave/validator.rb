module Agave
  module Validator
    def self.all
      [
        Size,
        FileSize,
        Length,
        Enum,
        Format,
        Required,
        DateRange,
        NumberRange,
        ItemItemType,
        ItemsItemType,
        RichTextBlocks,
        Unique,
        Extension
      ]
    end

    def self.with_code(code)
      all.detect do |field_type|
        field_type.code == code
      end
    end
  end
end
