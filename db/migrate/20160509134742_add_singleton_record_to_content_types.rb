class AddSingletonRecordToContentTypes < ActiveRecord::Migration[5.2]
  def change
    add_reference :content_types, :singleton_record, index: true
  end
end
