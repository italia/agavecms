require "rails_helper"

RSpec.describe RemoveAssociation do
  subject(:command) { described_class.new(item, to_remove) }

  let(:site) { create(:site, locales: ["it"]) }
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
      appeareance: { type: "select" }
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
      appeareance: { type: "select" }
    )
  end

  before do
    item_type
    field
    localized_field
    item
  end

  describe "#call" do
    before do
      command.call
    end

    context do
      let(:to_remove) { item_one }

      it "removes XXX_one associations" do
        expect(item.data[field.id.to_s]).to be_nil
      end
    end

    context do
      let(:to_remove) { item_many }

      it "removes XXX_many associations" do
        expect(item.data[localized_field.id.to_s]["it"]).to eq []
      end
    end
  end
end
