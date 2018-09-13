class ChangeLinkValidators < ActiveRecord::Migration[5.2]
  def up
    remove_from_field_validators!("link", "item_item_type")
    remove_from_field_validators!("links", "items_item_type")
  end

  def remove_from_field_validators!(field_type, validator_id)
    Field.where(field_type: field_type).find_each do |field|
      validators = field.validators
      id = validators[validator_id].fetch("item_type", nil)
      validators[validator_id] = { item_types: [id] }
      field.update_attributes!(validators: validators)
    end
  end
end
