require "rails_helper"

RSpec.describe UpsertItemType do
  subject(:command) { described_class.new(site, item_type, payload) }

  let(:site) { create(:site) }
  let(:item_type) do
    build(:item_type, site: site, sortable: sortable)
  end

  let(:sortable) { false }
  let(:api_key) { "an_api_key" }
  let(:name) { "a name" }
  let(:singleton) { false }
  let(:ordering) { [nil, nil] }

  let(:payload) do
    {
      attributes: {
        sortable: sortable,
        api_key: api_key,
        name: name,
        singleton: singleton,
        ordering_direction: ordering[1]
      },
      relationships: {
        ordering_field: {
          data: ordering[0] && { type: "field", id: ordering[0].to_param }
        }
      }
    }
  end

  describe "#reorder_items" do
    let(:reorder_item) do
      instance_double("ItemMigration::Reorder", call: true)
    end

    before do
      allow(ItemMigration::Reorder).to receive(:new).
        with(item_type).
        and_return(reorder_item)
      allow(reorder_item).to receive(:call)
    end

    it "runs the Reorder command" do
      command.reorder_items
      expect(reorder_item).to have_received(:call)
    end
  end

  describe "#call" do
    let(:result) { command.call }

    it "updates the item type" do
      result
      expect(item_type.name).to eq name
      expect(item_type.singleton).to eq singleton
      expect(item_type.site).to eq site
      expect(item_type.sortable).to eq sortable
      expect(item_type.api_key).to eq api_key
    end

    describe "becomes singleton" do
      let(:singleton) { true }

      before do
        item_type.save
      end

      context "one item" do
        let(:item) { item_type.items.create!(data: {}) }

        before do
          item
        end

        it "becomes the item type singleton item" do
          result
          item_type.reload
          expect(item_type.singleton_item).to eq(item)
        end
      end

      context "more than one item" do
        before do
          item_type.items.create!(data: {})
          item_type.items.create!(data: {})
        end

        it "raises InvalidRecordError" do
          expect { result }.to raise_error(InvalidRecordError) { |ex|
            expect(ex.errors.first.details[:code]).to eq "MULTIPLE_INSTANCES_OF_SINGLETON"
          }
        end
      end

      context "used as reference/rich-text block" do
        before do
          secondary_item_type = create(:item_type, site: site)
          create(
            :field,
            item_type: secondary_item_type,
            api_key: "many",
            field_type: "links",
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

        it "raises InvalidRecordError" do
          expect { result }.to raise_error(InvalidRecordError) { |ex|
            expect(ex.errors.first.details[:code]).to eq "SINGLETONS_CANNOT_BE_USED_AS_REFERENCE"
          }
        end
      end
    end

    describe "ordering_field" do
      let(:field) do
        create(
          :field,
          item_type: item_type,
          api_key: "published_at",
          field_type: "date",
          validators: {},
          appeareance: {}
        )
      end

      before do
        field
      end

      context "only field is set (not direction)" do
        let(:ordering) { [field, nil] }

        it "raises error" do
          expect { result }.to raise_error InvalidRecordError
        end
      end

      context "only direction is set (not field)" do
        let(:ordering) { [nil, "desc"] }

        it "raises error" do
          expect { result }.to raise_error InvalidRecordError
        end
      end

      context "invalid direction" do
        let(:ordering) { [field, "foo"] }

        it "raises error" do
          expect { result }.to raise_error InvalidRecordError
        end
      end

      context "ordering if singleton" do
        let(:ordering) { [field, "desc"] }
        let(:singleton) { true }

        it "raises error" do
          expect { result }.to raise_error InvalidRecordError
        end
      end

      context "ordering if sortable" do
        let(:ordering) { [field, "desc"] }
        let(:sortable) { true }

        it "raises error" do
          expect { result }.to raise_error InvalidRecordError
        end
      end

      context "correct update" do
        let(:ordering) { [field, "desc"] }

        it "updates fields" do
          result
          item_type.reload
          expect(item_type.ordering_direction).to eq "desc"
          expect(item_type.ordering_field).to eq field
        end
      end
    end

    describe "sortable attribute" do
      before do
        item_type.save!
        item_type.update_attributes(sortable: starting_sortable)
        item_type.reload
        allow(command).to receive(:reorder_items)
        result
      end

      context "from false to true" do
        let(:starting_sortable) { false }
        let(:sortable) { true }

        it "reorders all items" do
          expect(command).to have_received(:reorder_items)
        end
      end
    end
  end
end
