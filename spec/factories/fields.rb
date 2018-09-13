FactoryBot.define do
  factory :field do
    item_type
    sequence(:label) { |i| "Field #{i}" }
    sequence(:api_key) { |i| "field_#{i}" }
    field_type Agave::FieldType::String.code
    validators { {} }
    appeareance { { type: "plain" } }
    position 1
  end
end
