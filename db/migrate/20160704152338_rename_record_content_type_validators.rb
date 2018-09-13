class RenameRecordContentTypeValidators < ActiveRecord::Migration[5.2]
  def up
    Field.all.each do |field|
      validators = field.validators
      if validators["record_content_type"]
        puts "here!"
        validators["item_item_type"] = {
          item_type: validators.delete("record_content_type")["content_type"]
        }
      end
      if validators["records_content_type"]
        puts "there!"
        validators["items_item_type"] = {
          item_type: validators.delete("records_content_type")["content_type"]
        }
      end
      field.update_attributes!(validators: validators)
    end
  end

  def down
  end
end
