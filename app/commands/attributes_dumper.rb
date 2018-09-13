class AttributesDumper
  attr_reader :fields, :site, :locales, :attributes,
    :keys_as_id_in_input, :keys_as_id_in_output,
    :values_as_data_in_input, :values_as_data_in_output, :item_uploads_cache

  def initialize(
    fields,
    site,
    attributes,
    keys_as_id_in_input,
    keys_as_id_in_output,
    values_as_data_in_input,
    values_as_data_in_output,
    item_uploads_cache = {}
  )
    @fields = fields
    @site = site
    @locales = site.locales
    @attributes = attributes
    @keys_as_id_in_input = keys_as_id_in_input
    @keys_as_id_in_output = keys_as_id_in_output
    @values_as_data_in_input = values_as_data_in_input
    @values_as_data_in_output = values_as_data_in_output
    @item_uploads_cache = item_uploads_cache
  end

  def dumped_attributes
    Hash[
      fields.map do |field|
        [
          keys_as_id_in_output ? field.id.to_s : field.api_key,
          dumped_attribute(field)
        ]
      end
    ]
  end

  private

  def dumped_attribute(field)
    if field.localized
      localized_dumped_attribute(field)
    else
      nonlocalized_dumped_attribute(field)
    end
  end

  def localized_dumped_attribute(field)
    Hash[
      locales.map do |locale|
        value = attributes[
          keys_as_id_in_input ? field.id.to_s : field.api_key
        ]

        value_for_locale = if value.is_a? Hash
          value[locale]
        end
        [
          locale,
          dump_value(field, value_for_locale)
        ]
      end
    ]
  end

  def nonlocalized_dumped_attribute(field)
    dump_value(
      field,
      attributes[keys_as_id_in_input ? field.id.to_s : field.api_key]
    )
  end

  def dump_value(field, value)
    field = field.agave_field_type(site, false, fields)

    if !values_as_data_in_input && values_as_data_in_output
      field.load(value)
    elsif !values_as_data_in_input && !values_as_data_in_output
      field.dump(field.load(value))
    elsif values_as_data_in_input && !values_as_data_in_output
      field.dump(value, item_uploads_cache)
    elsif values_as_data_in_input && values_as_data_in_output
      field.load(field.dump(value))
    end
  end
end
