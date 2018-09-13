class Field < ApplicationRecord
  INVALID_API_KEYS = %w(
    position is_valid id type updated_at attributes fields
    item_type is_singleton seo_meta_tags parent_id parent
    children
  )

  FIELD_TYPES_WITH_UPLOADS = %w(image gallery file seo)

  belongs_to :item_type,
    inverse_of: :fields

  has_many :item_uploads, dependent: :destroy

  has_many :uploads,
    inverse_of: :site,
    through: :item_uploads

  validates :item_type, :label, :api_key, :field_type, :presence,
    presence: true

  validates :field_type,
    inclusion: { in: Agave::FieldType.codes }

  validates :label,
    uniqueness: { scope: :item_type_id }

  validates :api_key,
    uniqueness: { scope: :item_type_id },
    format: { with: /\A[a-z_0-9]+\z/ }

  scope :by_position, -> { order("position ASC") }

  scope :with_positions_between, -> (min, max) {
    where("position >= ?", min).where("position <= ?", max)
  }

  scope :localized, -> { where(localized: true) }
  scope :non_localized, -> { where(localized: false) }

  validate :check_field_type_validity
  validate :check_api_key_validity

  def agave_field_type(_site = nil, generate_validators = true, fields = [])
    klass = Agave::FieldType.with_code(field_type)

    if klass
      klass.new(
        self,
        generate_validators && validators ? validators : {},
        appeareance,
        fields
    )
    end
  end

  private

  def check_field_type_validity
    return if !field_type || !item_type

    begin
      agave_field_type
    rescue ArgumentError => e
      errors.add(:validators, e.message)
    end
  end

  def check_api_key_validity
    if INVALID_API_KEYS.include?(api_key)
      errors.add(:api_key, :reserved)
    end
  end
end
