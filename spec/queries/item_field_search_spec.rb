require "rails_helper"

RSpec.describe ItemFieldSearch do
  subject(:search) do
    described_class.new(scope, matching_field, value, locale)
  end

  let(:scope) { item_type.items.all }

  let(:item_type) { create(:item_type) }

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
        field.id.to_s => "foobar",
        localized_field.id.to_s => {
          it: "qux"
        }
      }
    )
  end

  let(:non_matching_item1) do
    create(
      :item,
      item_type: item_type,
      data: {
        field.id.to_s => "foobar2",
        localized_field.id.to_s => {
          it: "qux2"
        }
      }
    )
  end

  let(:non_matching_item2) do
    create(
      :item,
      item_type: item_type,
      data: {
        field.id.to_s => nil,
        localized_field.id.to_s => {
          it: nil
        }
      }
    )
  end

  before do
    item_type
    field
    localized_field
    matching_item
    non_matching_item1
    non_matching_item2
  end

  describe "#call" do
    let(:result) { search.call }

    context "localized" do
      let(:matching_field) { localized_field }
      let(:value) { "qux" }
      let(:locale) { :it }

      it "returns items matching the specified field value" do
        expect(result).to eq [matching_item]
      end
    end

    context "non localized" do
      let(:matching_field) { field }
      let(:value) { "foobar" }
      let(:locale) { nil }

      it "returns items matching the specified field value" do
        expect(result).to eq [matching_item]
      end
    end
  end
end
