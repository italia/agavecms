class DuplicateItemType
  attr_reader :site, :item_type

  def initialize(site, item_type)
    @site = site
    @item_type = item_type
  end

  def call
    new_item_type = ItemType.new

    payload = {
      attributes: {
        name: new_name,
        api_key: new_api_key,
        singleton: item_type.singleton,
        sortable: item_type.sortable
      },
      relationships: {
        ordering_field: {
          data: nil
        }
      }
    }

    UpsertItemType.new(
      item_type.site,
      new_item_type,
      payload
    ).call

    if new_item_type.save
      field_ids_mapping = {}

      item_type.fields.order("created_at ASC").each do |field|
        new_field = Field.new(
          item_type: new_item_type,
          label: field.label,
          api_key: field.api_key,
          field_type: field.field_type,
          hint: field.hint,
          localized: field.localized,
          position: field.position,
          appeareance: field.appeareance,
          validators: field.validators
        )

        if field.field_type == "slug"
          new_field.update_attributes!(
            appeareance: {
              title_field_id: field_ids_mapping[field.appeareance["title_field_id"]],
              url_prefix: field.appeareance["url_prefix"]
            }
          )
        end

        new_field.save!

        if item_type.ordering_field && item_type.ordering_field == field
          new_item_type.update_attributes!(
            ordering_field: new_field,
            ordering_direction: item_type.ordering_direction
          )
        end

        field_ids_mapping = field_ids_mapping.merge(
          field.id.to_s => new_field.id.to_s
        )
      end
    end

    new_item_type
  end

  def new_name
    @new_name ||= begin
      matches = item_type.name.match(/(.+) \(copy #(\d+)\)$/)

      base = matches ? matches[1] : item_type.name
      incrementer = matches ? (matches[2].to_i + 1) : 1

      loop do
        incremented_name = "#{base} (copy ##{incrementer})"
        exist = site.item_types.where(name: incremented_name).count > 0

        return incremented_name if !exist

        incrementer += 1
      end
    end
  end

  def new_api_key
    @new_api_key ||= begin
      matches = item_type.api_key.match(/(.+)_copy_(\d+)$/)

      base = matches ? matches[1] : item_type.api_key
      incrementer = matches ? (matches[2].to_i + 1) : 1

      loop do
        incremented_api_key = "#{base}_copy_#{incrementer}"
        exist = site.item_types.where(api_key: incremented_api_key).count > 0

        return incremented_api_key if !exist

        incrementer += 1
      end
    end
  end
end
