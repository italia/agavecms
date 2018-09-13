module ItemMigration
  class Validate
    attr_reader :item_type

    def initialize(item_type)
      @item_type = item_type
    end

    def call
      item_type.items.each do |item|
        validate_single_item(item)
      end
    end

    def validate_single_item(item)
      ActiveRecord::Base.record_timestamps = false

      attributes = AttributesDumper.new(
        fields, site, item.data,
        true, false,
        true, false,
        item_uploads.index_by(&:id)
      ).dumped_attributes

      ItemValidator.new(item.item_type, attributes, item.id).call
    rescue InvalidRecordError
      item.update_attributes!(is_valid: false)
    else
      item.update_attributes!(is_valid: true)
    ensure
      ActiveRecord::Base.record_timestamps = true
    end

    def item_uploads
      @item_uploads ||= begin
                        ids = ItemUploadsIds.new(
                          item_type.items,
                          item_type,
                          locales
                        ).call

                        ItemUpload.where(id: ids).includes(:upload)
                      end
    end

    def locales
      item_type.site.locales
    end

    def fields
      item_type.fields
    end

    def site
      item_type.site
    end
  end
end
