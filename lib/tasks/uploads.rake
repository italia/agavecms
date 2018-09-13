namespace :uploads do
  task fix: :environment do
    ItemUpload.includes(:upload, { field: :item_type }, item: :item_type).find_each do |item_upload|
      upload_site_id = item_upload.upload.site_id
      field_site_id = item_upload.field.item_type.site_id
      item_site_id = item_upload.item.item_type.site_id

      if upload_site_id != field_site_id || field_site_id != item_site_id || upload_site_id != item_site_id
        upload = Upload.create!(
          Upload.first.attributes.except("site_id", "created_at", "updated_at", "id").merge(
            site_id: field_site_id
          )
        )

        item_upload.update_attributes!(
          upload_id: upload.id
        )

        puts "----"
        puts "ItemUpload: #{item_upload.id}"
        puts "upload_site_id: #{upload_site_id}"
        puts "field_site_id: #{field_site_id}"
        puts "item_site_id: #{item_site_id}"
        puts "upload: #{item_upload.upload.id}"
        puts "new upload_id: #{item_upload.upload.id}"
      end
    end
  end
end
