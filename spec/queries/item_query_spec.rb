require "rails_helper"

RSpec.describe ItemQuery, type: :model do
  subject(:query) { described_class.new(site, params, role) }
  let(:role) { Role::Value.new(Authenticator::ADMIN_ROLE) }
  let(:site) { create(:site) }
  let(:params) { {} }

  it { is_expected.to be_a described_class }

  describe "#scope" do
    let(:result) { query.scope }
    let(:items) { result[0] }
    let(:total_count) { result[1] }
    let(:item_type) { create(:item_type, site: site) }

    let(:field) do
      create(
        :field,
        item_type: item_type,
        api_key: "string",
        field_type: "string",
        appeareance: { type: "plain" }
      )
    end

    let(:the_item) do
      create(
        :item,
        item_type: item_type,
        is_valid: false,
        data: { field.id.to_s => "foo" }
      )
    end

    let(:another_item) do
      create(
        :item,
        item_type: item_type,
        is_valid: true,
        data: { field.id.to_s => "bar" }
      )
    end

    before do
      the_item
      another_item
    end

    context "id param" do
      let(:params) do
        {
          filter: {
            ids: [the_item.id, another_item.id].join(",")
          }
        }
      end

      before do
        create_list(:item, 50, item_type: item_type)
      end

      it "returns only the selected items" do
        expect(items).to match_array [the_item, another_item]
      end
    end

    context "page param" do
      before do
        create_list(:item, 50, item_type: item_type)
      end

      context "without" do
        it "returns first 30 elements" do
          expect(items.size).to eq 30
        end
      end

      context "with a valid value" do
        let(:params) { { page: { limit: 10 } } }

        it "returns first 10 elements" do
          expect(items.size).to eq 10
        end
      end
    end

    context "only_valid param" do
      context "if set" do
        let(:params) do
          { filter: { only_valid: "foo" } }
        end

        it "returns only valid items" do
          expect(items).to include(another_item)
          expect(items).to_not include(the_item)
        end
      end

      context "if not set" do
        it "returns both kind" do
          expect(items).to include(another_item)
          expect(items).to include(the_item)
        end
      end
    end

    context "real-world" do
      context "with a true value" do
        let(:params) do
          { filter: { query: "foo", type: item_type.id } }
        end

        it "returns only valid items" do
          expect(items).to include(the_item)
          expect(items).to_not include(another_item)
        end
      end
    end

    context "ordering" do
      let(:params) do
        { filter: { type: item_type.id } }
      end

      context "desc" do
        before do
          item_type.update_attributes(
            ordering_field: field,
            ordering_direction: "desc"
          )
        end

        it "sorts items" do
          expect(items).to eq [the_item, another_item]
        end
      end

      context "asc" do
        before do
          item_type.update_attributes(
            ordering_field: field,
            ordering_direction: "asc"
          )
        end

        it "sorts items" do
          expect(items).to eq [another_item, the_item]
        end
      end
    end
  end
end
