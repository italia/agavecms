class NestedItems
  attr_reader :item

  def initialize(item)
    @item = item
  end

  def call
    ids = item_ids_in_fields(
      embedded_link_fields + rich_text_fields
    ).flatten.compact.uniq

    Item.where(id: ids)
  end

  private

  def embedded_link_fields
    item_type.fields.where(field_type: [
      Agave::FieldType::Link.code,
      Agave::FieldType::Links.code
    ]).
      select { |field| field.appeareance["type"] == "embed" }
  end

  def rich_text_fields
    item_type.fields.where(field_type: Agave::FieldType::RichText.code)
  end

  def item_ids_in_fields(fields)
    fields.map do |field|
      read_attribute(field)
    end
  end

  def read_attribute(field)
    if field.localized
      item.data[field.id.to_s].values
    else
      [item.data[field.id.to_s]]
    end
  end

  def item_type
    @item_type ||= item.item_type
  end
end
