class ReplaceUploadsPayloadWithItemUploadIds
  attr_reader :fields, :site, :attributes, :item, :data

  def initialize(fields, site, attributes, item, data)
    @fields = fields
    @site = site
    @locales = site.locales
    @attributes = attributes
    @item = item
    @data = data.deep_dup
  end

  def replaced_data
    old_item_upload_ids = ItemUpload.
      where(field: fields, item: item).
      pluck(:id).
      map(&:to_s)

    new_item_upload_ids = []

    fields.each do |field|
      if Field::FIELD_TYPES_WITH_UPLOADS.include?(field.field_type)
        if attributes.has_key?(field.api_key)
          value, item_upload_ids = UpsertFieldUpload.new(
            field,
            site,
            attributes.except(:position),
            item,
            data
          ).converted_value_and_created_item_upload_ids

          data[field.id.to_s] = value
          new_item_upload_ids += item_upload_ids
        end
      end
    end

    ItemUpload.where(id: old_item_upload_ids - new_item_upload_ids).delete_all

    data
  end

  class UpsertFieldUpload
    attr_reader :field, :site, :attributes, :item, :data

    def initialize(field, site, attributes, item, data)
      @field = field
      @site = site
      @locales = site.locales
      @attributes = attributes
      @item = item
      @data = data
      @created_item_upload_ids = []
    end

    def converted_value_and_created_item_upload_ids
      [converted_value, @created_item_upload_ids]
    end

    def converted_value
      value = attributes[field.api_key]

      if value.nil?
        return value
      end

      if field.localized
        Hash[
          value.keys.map do |locale|
            new_value = if value[locale]
              item_upload_id(value[locale], locale)
            end

            [locale, new_value]
          end
        ]
      else
        item_upload_id(value, nil)
      end
    end

    private

    def item_upload_id(value, locale)
      if value.is_a? Array
        value.map do |gallery_item|
          create_or_update_upload(gallery_item, locale)
        end
      elsif field.field_type == "seo"
        if value["image"]
          item_upload_id = create_or_update_upload(value["image"], locale)
          value.merge!(image: item_upload_id)
        else
          value
        end
      else
        create_or_update_upload(value, locale)
      end
    end

    def create_or_update_upload(data, locale)
      return nil unless data

      upload = site.uploads.
        where(path: data["path"]).
        first_or_initialize

      upload.update_attributes!(
        path: data["path"],
        size: data["size"],
        width: data["width"],
        height: data["height"],
        format: data["format"],
        title: data["title"],
        alt: data["alt"],
        site: site
      )

      item_upload = upload.item_uploads.where(
        upload: upload,
        item: item,
        field: field,
        locale: locale
      ).first_or_create!

      id = item_upload.id.to_s

      @created_item_upload_ids << id

      id
    end
  end
end
