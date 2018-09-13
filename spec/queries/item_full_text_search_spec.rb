require "rails_helper"

RSpec.describe ItemFullTextSearch do
  subject(:search) do
    described_class.new(scope, item_type, query)
  end

  let(:query) { "query" }
  let(:scope) { Item.all }

  let(:item_type) do
    create(:item_type)
  end

  let(:field) do
    create(
      :field,
      item_type: item_type,
      api_key: "string",
      field_type: "string",
      appeareance: { type: "plain" }
    )
  end

  let(:localized_field) do
    create(
      :field,
      item_type: item_type,
      api_key: "text",
      field_type: "text",
      localized: true,
      appeareance: { type: "plain" }
    )
  end

  let(:matching_item) do
    create(
      :item,
      item_type: item_type,
      data: {
        field.id.to_s => "Query",
        localized_field.id.to_s => {
          it: "Bar"
        }
      }
    )
  end

  let(:non_matching_item) do
    create(
      :item,
      item_type: item_type,
      data: {
        field.id.to_s => "Foo",
        localized_field.id.to_s => {
          it: "Bar"
        }
      }
    )
  end

  before do
    item_type
    field
    localized_field
    matching_item
    non_matching_item
  end

  describe "#call" do
    let(:result) { search.call }

    it "generates a full-text query over text-based fields" do
      expect(result).to eq [matching_item]
    end
  end
end
