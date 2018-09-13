require "rails_helper"

module Agave
  module Validator
    RSpec.describe RichTextBlocks do
      subject(:validator) { described_class.new(validator_field, options) }
      let(:validator_field) { create(:field) }
      let(:item_type) { create(:item_type, site: site) }
      let(:site) { validator_field.item_type.site }
      let(:options) { { item_types: [item_type.id.to_s] } }

      context "with nil" do
        let(:options) { { item_types: nil } }

        it "raises ArgumentError" do
          expect { validator }.to raise_error ArgumentError
        end
      end

      context "with an empty array" do
        let(:options) { { item_types: [] } }

        it "does not raise an ArgumentError" do
          expect { validator }.not_to raise_error
        end
      end

      context "with a non-string item type id" do
        let(:options) { { item_types: [item_type.id] } }

        it "raises ArgumentError" do
          expect { validator }.to raise_error ArgumentError
        end
      end

      context "with invalid item type" do
        let(:item_type) { create(:item_type) }

        it "raises ArgumentError" do
          expect { validator }.to raise_error ArgumentError
        end
      end

      context "with singleton item type" do
        let(:item_type) { create(:item_type, site: site, singleton: true) }

        it "raises ArgumentError" do
          expect { validator }.to raise_error ArgumentError
        end
      end

      expectations = [
        [nil, true],
        ["", false],
        [[], true],
        [["invalid_id"], false]
      ]

      describe "#call" do
        expectations.each do |(value, expected_value)|
          context "with \"#{value}\"" do
            it "returns #{expected_value}" do
              expect(validator.call(value, nil, nil)).to be(expected_value)
            end
          end
        end

        context "with a item of a different item type" do
          let(:item) { create(:item, item_type: another_item_type) }
          let(:another_item_type) { create(:item_type, site: site) }

          it "returns false" do
            expect(validator.call([item.to_param], nil, nil)).to be_falsy
          end
        end

        context "with a nil item" do
          let(:item) { create(:item) }

          it "returns false" do
            expect(validator.call([nil, item.to_param], nil, nil)).to be_falsy
          end
        end

        context "with a item of a different site" do
          let(:item) { create(:item) }

          it "returns false" do
            expect(validator.call([item.to_param], nil, nil)).to be_falsy
          end
        end

        context "with a valid item type" do
          let(:item) { create(:item, item_type: item_type) }

          it "returns true" do
            expect(validator.call([item.to_param], nil, nil)).to be_truthy
          end
        end
      end
    end
  end
end
