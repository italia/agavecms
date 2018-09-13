require "rails_helper"

module Agave
  module FieldType
    RSpec.describe Agave::FieldType::Links do
      subject(:field_type) do
        described_class.new(field, {}, type: "select")
      end
      let(:field) { create(:field) }
      let(:item_type) { field.item_type }

      describe "#load" do
        subject(:result) do
          field_type.load(value)
        end

        context "with nil" do
          let(:value) { nil }
          it { is_expected.to eq nil }
        end

        context "with other types of value" do
          let(:value) { true }
          it { expect { result }.to raise_error InvalidFormatError }
        end

        context "given a item" do
          before do
            item
          end

          context "not belonging to the site" do
            let(:item) { create(:item) }
            let(:value) { [item.to_param] }
            it { expect { result }.to raise_error InvalidFormatError }
          end

          context "belonging to the site" do
            let(:item) { create(:item, item_type: item_type) }

            context "integer" do
              let(:value) { [item.id] }
              it { expect { result }.to raise_error InvalidFormatError }
            end

            context "string" do
              let(:value) { [item.to_param] }
              it { is_expected.to eq [item.to_param] }
            end
          end
        end
      end
    end
  end
end
