require "rails_helper"

module ItemMigration
  RSpec.describe Validate do
    subject(:command) { described_class.new(item_type) }

    let(:item_type) { create(:item_type) }

    describe "#call" do
      let(:first_item) { create(:item, item_type: item_type) }
      let(:last_item) { create(:item, item_type: item_type) }

      before do
        first_item
        last_item
        allow(command).to receive(:validate_single_item)
      end

      before do
        command.call
      end

      it "calls validate_single_item for each item" do
        expect(command).to have_received(:validate_single_item).exactly(Item.count).times
      end
    end

    describe "#validate_single_item" do
      let(:validator) { instance_double(ItemValidator) }
      let(:updated_at) { DateTime.new(2010, 1, 1) }

      let(:item) do
        Timecop.freeze(updated_at) do
          create(
            :item,
            item_type: item_type,
            data: {
              field.id.to_s => value
            }
          )
        end
      end

      let(:item_type) { create(:item_type) }
      let(:field) do
        create(
          :field,
          item_type: item_type,
          field_type: "string",
          validators: { required: {} },
          appeareance: { type: "plain" }
        )
      end

      before do
        field
      end

      context "when item is valid" do
        let(:value) { "foo" }

        before do
          command.validate_single_item(item)
        end

        it "set the item as valid" do
          expect(item.is_valid).to be_truthy
        end

        it "preserves updated_at" do
          expect(item.updated_at).to eq updated_at
        end
      end

      context "when item is not valid" do
        let(:value) { nil }

        before do
          command.validate_single_item(item)
          item.reload
        end

        it "set the item as not valid" do
          expect(item.is_valid).to be_falsey
        end

        it "preserves updated_at" do
          expect(item.updated_at).to eq updated_at
        end
      end
    end
  end
end
