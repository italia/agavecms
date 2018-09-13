class DuplicateItem
  attr_reader :item
  attr_reader :add_suffix_to_title

  def initialize(item, add_suffix_to_title = false)
    @item = item
    @add_suffix_to_title = add_suffix_to_title
  end

  def call
    attributes = AttributesDumper.new(
      fields, site, new_data,
      true, false,
      true, false
    ).dumped_attributes

    is_valid = begin
      ItemValidator.new(item_type, attributes, nil).call
      true
    rescue InvalidRecordError
      false
    end

    item_type.items.create!(
      data: new_data,
      is_valid: is_valid,
      position: next_available_position,
      parent_id: item.parent_id,
    )
  end

  private

  def next_available_position
    if item_type.tree
      max_position = item_type.items.children_of(item.parent).maximum(:position) || 0
      max_position + 1
    else
      max_position = item_type.items.maximum(:position) || 0
      max_position + 1
    end
  end

  def new_data
    @new_data ||= begin
      old_data = item.data
      new_data = {}

      fields.each do |field|
        new_data[field.id.to_s] = new_field_value(
          field,
          old_data[field.id.to_s]
        )
      end

      new_data
    end
  end

  def new_field_value(field, value)
    if field.localized
      Hash[
        value.map do |locale, locale_value|
          [locale, new_field_raw_value(field, locale_value)]
        end
      ]
    else
      new_field_raw_value(field, value)
    end
  end

  def new_field_raw_value(field, value)
    if to_duplicate?(field)
      if value.is_a?(Array)
        value.map do |id|
          DuplicateItem.new(Item.find(id)).call.id.to_s
        end
      else
        DuplicateItem.new(Item.find(id)).call.id.to_s
      end
    elsif (
      field.field_type == "string" &&
        field.appeareance["type"] == "title" &&
        add_suffix_to_title
    )
      "#{value} (duplicate)"
    else
      value
    end
  end

  def to_duplicate?(field)
    field.field_type == "rich_text" || (
      %w(link links).include?(field.field_type) &&
        field.appeareance["type"] == "embed"
    )
  end

  def fields
    item_type.fields
  end

  def site
    item_type.site
  end

  def item_type
    item.item_type
  end

  def locales
    site.locales
  end
end
