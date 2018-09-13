class Agave::Appeareance::Link < Agave::Appeareance::Base
  attribute :type, String

  validates :type,
    presence: true,
    inclusion: { in: %w(select embed) }
end
