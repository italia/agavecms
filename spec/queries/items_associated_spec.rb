require "rails_helper"

RSpec.describe ItemsAssociated do
  subject(:query) { described_class.new([linked_item, another_item], item_type) }
  let(:site) { create(:site, locales: ["it"]) }
  let(:another_item) { create(:item) }

  context "with a item type that links to the specified item" do
    let(:item_type) do
      create(:item_type, site: site)
    end

    let(:item) do
      create(
        :item,
        item_type: item_type,
        data: {
          field.id.to_s => item_one.to_param,
          localized_field.id.to_s => {
            it: [item_many.to_param]
          }
        }
      )
    end

    let(:item_one) { create(:item, item_type: item_type) }
    let(:item_many) { create(:item, item_type: item_type) }

    let(:field) do
      create(
        :field,
        item_type: item_type,
        api_key: "one",
        field_type: "link",
        validators: {
          item_item_type: {
            item_types: [item_type.id.to_s]
          }
        },
        appeareance: {
          type: "select"
        }
      )
    end

    let(:localized_field) do
      create(
        :field,
        item_type: item_type,
        api_key: "many",
        field_type: "links",
        localized: true,
        validators: {
          items_item_type: {
            item_types: [item_type.id.to_s]
          }
        },
        appeareance: {
          type: "select"
        }
      )
    end

    before do
      item_type
      field
      localized_field
      item
    end

    describe "#call" do
      context do
        let(:linked_item) { item_one }

        it "catches link associations" do
          expect(query.call.to_a).to eq [item]
        end
      end

      context do
        let(:linked_item) { item_many }

        it "catches links associations" do
          expect(query.call.to_a).to eq [item]
        end
      end

      context do
        let(:linked_item) { item_many }

        it "catches links associations" do
          expect(query.call.to_a).to eq [item]
        end
      end
    end
  end

  context "with an unrelated content" do
    let(:item_type) do
      create(:item_type, site: site)
    end

    let(:item) do
      create(
        :item,
        item_type: item_type,
        data: {}
      )
    end

    let(:item) { create(:item, item_type: item_type) }
    let(:linked_item) { create(:item, item_type: item_type) }

    before do
      linked_item
      item
    end

    it "returns an empty array" do
      expect(query.call.to_a).to eq []
    end
  end
end
