class Agave::Appeareance::Text < Agave::Appeareance::Base
  attribute :type, String

  validates :type,
    presence: true,
    inclusion: { in: %w(plain wysiwyg markdown) }
end
