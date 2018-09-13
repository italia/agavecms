class ItemUpload < ApplicationRecord
  belongs_to :upload, foreign_key: :upload_path
  belongs_to :item
  belongs_to :field

  #validates :upload, :item, :field, presence: true
  validate :check_coherence_of_site!

  private

  def check_coherence_of_site!
    return if Rails.env.test?

    upload_site_id = upload.site_id
    field_site_id = field.item_type.site_id
    item_site_id = item.item_type.site_id

    upload_site_id == field_site_id && field_site_id == item_site_id or
      errors.add(:base, :incoherent_site)
  end
end
