class Agave::Appeareance::String < Agave::Appeareance::Base
  attribute :type, String

  validates :type,
    presence: true,
    inclusion: { in: %w(plain title) }
end
