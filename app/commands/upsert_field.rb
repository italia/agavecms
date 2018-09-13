class UpsertField
  attr_reader :attributes, :field, :new_record

  def initialize(field, attributes)
    @attributes = attributes[:data].with_indifferent_access[:attributes]
    @field = field
    @new_record = field.new_record?
  end

  def call
    if new_record
      create_field
    else
      update_field
    end
  rescue ActiveRecord::RecordInvalid => error
    raise InvalidRecordError.from_record_invalid(error)
  end

  private

  def create_field
    field.update_attributes!(params)
    add_empty_field_to_items!
    run_validations!
    notify_changes!
  end

  def update_field
    check_for_change_in_field_type!

    old_position = field.position

    run_validations_if_required do
      localize_field_if_required do
        delocalize_field_if_required do
          field.update_attributes!(params)
        end
      end
    end

    move_fields_position!(old_position)
  end

  def localize_field_if_required
    old_localized = field.localized

    yield

    if !old_localized && field.localized
      ItemMigration::LocalizeField.new(field).call
    end
  end

  def delocalize_field_if_required
    old_localized = field.localized

    yield

    if old_localized && !field.localized
      ItemMigration::DelocalizeField.new(field).call
    end
  end

  def run_validations_if_required
    old_validators = field.validators
    old_localized = field.localized

    yield

    if field.localized != old_localized ||
        field.validators != old_validators
      ItemMigration::Validate.new(field.item_type).call
      notify_changes!
    end
  end

  def run_validations!
    ItemMigration::Validate.new(field.item_type).call
  end

  def params
    attributes.slice(
      :label, :api_key, :hint, :field_type,
      :validators, :localized, :appeareance
    ).merge(position: new_position)
  end

  def notify_changes!
    NotifySiteChange.new(site).call
  end

  def check_for_change_in_field_type!
    if attributes.has_key?(:field_type)
      attributes[:field_type] == field.field_type or
        raise InvalidRecordError.new("cannot change data type")
    end
  end

  def move_fields_position!(old_position)
    if old_position != new_position
      fields = item_type.fields.with_positions_between(
        *[old_position, new_position].sort
      ).where.not(id: field.id)

      amount = new_position < old_position ? 1 : -1

      fields.update_all(["position = position + (?)", amount])
    end
  end

  def new_position
    if new_record
      next_available_position
    else
      attributes[:position] || field.position
    end
  end

  def next_available_position
    max_position = item_type.fields.maximum(:position) || 0
    max_position + 1
  end

  def add_empty_field_to_items!
    ItemMigration::AddField.new(field).call
  end

  def item_type
    @item_type ||= field.item_type
  end

  def site
    @site ||= item_type.site
  end

  def items
    @items ||= item_type.items
  end
end
