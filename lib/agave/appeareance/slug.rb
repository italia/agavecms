class Agave::Appeareance::Slug < Agave::Appeareance::Base
  attribute :title_field_id, String
  attribute :url_prefix, String

  validates :title_field_id, presence: true
  validate :check_title_field_exists

  private

  def check_title_field_exists
    title_field = fields_cache.detect { |f| f.id.to_s == title_field_id } ||
                  field.item_type.fields.where(id: title_field_id).first

    title_field or errors.add(:title_field_id, :invalid)
  end
end
