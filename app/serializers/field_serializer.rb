class FieldSerializer < ApplicationSerializer
  attributes :label, :field_type, :api_key, :hint, :localized, :validators,
    :position, :appeareance

  belongs_to :item_type

  def appeareance
    object.appeareance
  end
end
