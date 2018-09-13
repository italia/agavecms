class RemoveAssociation
  attr_reader :item, :to_remove

  def initialize(item, to_remove)
    @item = item
    @to_remove = Array(to_remove).map(&:to_param)
  end

  def call
    remove_one_associations
    remove_many_associations(Agave::FieldType::Links)
    remove_many_associations(Agave::FieldType::RichText)

    attributes = AttributesDumper.new(
      fields, site, item.data,
      true, false,
      true, false
    ).dumped_attributes

    ItemValidator.new(item_type, attributes, item.id).call
    item.save!
  end

  private

  def remove_one_associations
    fields_of_type(Agave::FieldType::Link).each do |field|
      replace_field_value(field) do |value|
        to_remove.include?(value) ? nil : value
      end
    end
  end

  def remove_many_associations(type)
    fields_of_type(type).each do |field|
      replace_field_value(field) do |value|
        Array(value) - to_remove
      end
    end
  end

  def replace_field_value(field)
    value = item.data[field.id.to_s]
    if field.localized?
      locales.each do |locale|
        value[locale] = yield value[locale]
      end
    else
      item.data[field.id.to_s] = yield value
    end
  end

  def fields_of_type(type)
    fields.select { |field| field.field_type == type.code }
  end

  def item_type
    @item_type ||= item.item_type
  end

  def locales
    @locales ||= site.locales
  end

  def site
    @site ||= item_type.site
  end

  def fields
    @fields ||= item_type.fields
  end
end
