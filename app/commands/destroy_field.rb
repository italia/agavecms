class DestroyField
  attr_reader :field, :field_id, :item_type, :site

  def initialize(field)
    @field = field
    @field_id = field.id
    @item_type = field.item_type
    @site = @item_type.site
  end

  def call
    ensure_field_is_not_used_as_source_for_a_slug!
    field.destroy!
    remove_field_from_item_type_items!
    run_validations!
    notify_changes!
  end

  private

  def ensure_field_is_not_used_as_source_for_a_slug!
    slug_field = item_type.fields.
      where(field_type: Agave::FieldType::Slug.code).
      detect do |f|
      f.appeareance["title_field_id"] == field.to_param
    end

    slug_field and raise InvalidRecordError.new(
      "Cannot destroy field as it's used by some slug field",
      ApiError.new(
        "USED_AS_SLUG_SOURCE",
        field_api_key: slug_field.api_key,
        field_label: slug_field.label
      )
    )
  end

  def notify_changes!
    NotifySiteChange.new(site).call
  end

  def run_validations!
    ItemMigration::Validate.new(item_type).call
  end

  def remove_field_from_item_type_items!
    ItemMigration::RemoveField.new(field).call
  end
end
