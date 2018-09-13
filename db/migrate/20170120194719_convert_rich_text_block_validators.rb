class ConvertRichTextBlockValidators < ActiveRecord::Migration[5.2]
  def change
    Field.where(field_type: "rich_text").find_each do |field|
      validator = field.validators.delete("items_item_type")
      field.validators["rich_text_blocks"] = validator
      field.save!
    end
  end
end
