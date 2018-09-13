class Agave::Appeareance::Color < Agave::Appeareance::Base
  attribute :enable_alpha, Virtus::Attribute::Boolean
  attribute :preset_colors, Array[String]

  validate :alpha_is_a_boolean

  private

  def alpha_is_a_boolean
    if ![true, false].include?(enable_alpha)
      errors.add(:enable_alpha, :invalid)
    end
  end
end
