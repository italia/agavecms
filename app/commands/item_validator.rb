class ItemValidator
  attr_reader :item_type, :attributes, :item_id

  def initialize(item_type, attributes, item_id)
    @item_type = item_type
    @attributes = attributes.with_indifferent_access
    @item_id = item_id
  end

  def call
    check_for_extraneous_attributes!
    check_for_localized_attribute_values_format!
    check_for_attribute_values!
    check_for_position_value!
    check_for_parent_id_value!
  end

  private

  def check_for_extraneous_attributes!
    keys = Set.new(attributes.keys)
    valid_keys = Set.new(valid_field_keys)
    invalid_keys = (keys - valid_keys).to_a

    keys.subset?(valid_keys) or
      raise InvalidRecordError.new(
      "invalid attributes for #{item_type.name}: #{invalid_keys}",
      ApiError.new(
        "INVALID_ATTRIBUTES",
        extraneous_attributes: keys - valid_keys
      )
    )
  end

  def valid_field_keys
    fields_key = fields.map(&:api_key)

    if item_type.sortable || item_type.tree
      fields_key << "position"
    end

    if item_type.tree
      fields_key << "parent_id"
    end

    fields_key
  end

  def check_for_localized_attribute_values_format!
    errors = fields.
      select(&:localized).
      map { |field| localized_format_errors_for_field(field) }.
      flatten

    if errors.any?
      raise InvalidRecordError.new("invalid format #{errors.inspect}", errors)
    end
  end

  def localized_format_errors_for_field(field)
    value = attributes[field.api_key]

    value.is_a? Hash or
      return ApiError.new(
      "INVALID_FIELD",
      field: field.api_key, code: "LOCALIZATION_HASH_REQUIRED"
    )

    Set.new(value.keys) == Set.new(locales) or
      return ApiError.new(
      "INVALID_FIELD",
      field: field.api_key, code: "INVALID_LOCALES"
    )

    []
  end

  def check_for_position_value!
    return unless item_type.sortable || item_type.tree

    if attributes.has_key?(:position)
      attributes[:position].is_a? Integer or
        raise InvalidRecordError.new(
        "invalid position value type",
        ApiError.new("INVALID_POSITION")
      )
    end
  end

  def check_for_parent_id_value!
    return unless item_type.tree

    if attributes.has_key?(:parent_id)
      if (attributes[:parent_id])
        attributes[:parent_id].is_a? String or
          raise InvalidRecordError.new(
          "invalid position value type",
          ApiError.new("INVALID_PARENT_ID")
        )

        item_type.items.find_by_id(attributes[:parent_id]) or
          raise InvalidRecordError.new(
          "invalid position value type",
          ApiError.new("INVALID_PARENT_ID")
        )
      end
    end
  end

  def check_for_attribute_values!
    errors = fields.
      map { |field| value_errors_for_field(field) }.
      flatten

    if errors.any?
      raise InvalidRecordError.new(
        "invalid attributes #{errors.inspect}",
        errors
      )
    end
  end

  def value_errors_for_field(field)
    locales.map do |locale|
      format_errors = format_errors_for_field(locale, field)
      if format_errors.empty?
        validator_errors_for_field(locale, field)
      else
        format_errors
      end
    end.flatten
  end

  def format_errors_for_field(locale, field)
    valid_format, errors = field.agave_field_type.valid_format?(
      attributes_for_locale(locale)[field.api_key]
    )

    if !valid_format
      Array(
        ApiError.new(
          "INVALID_FIELD",
          field: field.api_key,
          field_id: field.to_param,
          field_label: field.label,
          locale: field.localized ? locale : nil,
          errors: errors,
          code: "INVALID_FORMAT"
        )
      )
    else
      []
    end
  end

  def validator_errors_for_field(locale, field)
    failing_validators = field.agave_field_type.failing_validators(
      attributes_for_locale(locale),
      field.api_key,
      locale,
      item_id
    )

    failing_validators.map do |validator|
      ApiError.new(
        "INVALID_FIELD",
        field: field.api_key,
        field_id: field.to_param,
        field_label: field.label,
        locale: field.localized ? locale : nil,
        code: "VALIDATION_#{validator.class.code.upcase}",
        options: validator.attributes
      )
    end
  end

  def attributes_for_locale(locale)
    Hash[
      fields.map do |field|
        if field.localized
          [field.api_key, attributes[field.api_key][locale]]
        else
          [field.api_key, attributes[field.api_key]]
        end
      end
    ]
  end

  def fields
    item_type.fields.
      select { |field| attributes.keys.include?(field.api_key) }
  end

  def locales
    item_type.site.locales
  end
end
