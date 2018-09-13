require "rails_helper"

module ItemMigration
  RSpec.describe Reorder do
    subject(:command) { described_class.new(item_type) }

    let(:item_type) { create(:item_type, sortable: sortable) }
    let(:sortable) { false }

    describe "#call" do
      let(:result) { command.call }

      context "when item_type is not sortable" do
        let(:sortable) { false }

        it "does nothing" do
          expect(result).to be_falsy
        end
      end

      context "when item_type is sortable" do
        let(:sortable) { true }

        let(:first_item) do
          Timecop.freeze(first_updated_at) do
            create(:item, item_type: item_type, position: 1)
          end
        end

        let(:last_item) do
          Timecop.freeze(last_updated_at) do
            create(:item, item_type: item_type, position: 2)
          end
        end

        let(:first_updated_at) { DateTime.new(2010, 1, 1) }
        let(:last_updated_at) { DateTime.new(2016, 1, 1) }

        before do
          first_item
          last_item
        end

        it "reorder all items" do
          expect(result).to be_truthy
          expect(first_item.reload.position).to eq 2
          expect(last_item.reload.position).to eq 1
        end

        it "preserves updated_at" do
          expect(first_item.updated_at).to eq first_updated_at
          expect(last_item.updated_at).to eq last_updated_at
        end
      end
    end
  end
end
