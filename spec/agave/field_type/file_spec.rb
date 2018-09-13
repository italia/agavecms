require "rails_helper"

module Agave
  module FieldType
    RSpec.describe Agave::FieldType::File do
      subject(:field_type) { described_class.new(field) }
      let(:field) { build(:field) }

      describe "#load" do
        subject(:result) do
          field_type.load(value)
        end

        context "with a file hash" do
          let(:value) do
            {
              path: "foobar.jpg",
              format: "JPG",
              size: 500
            }
          end

          it { is_expected.to be_a ::Hash }

          it "normalizes format" do
            expect(result["format"]).to eq "jpg"
          end
        end

        context "with nil" do
          let(:value) { nil }
          it { is_expected.to eq nil }
        end

        context "with a invalid hash" do
          let(:value) do
            {
              path: "foobar.jpg"
            }
          end
          it { expect { result }.to raise_error InvalidFormatError }
        end

        context "with missing values" do
          let(:value) do
            {
              path: "foobar.jpg",
              format: "JPG",
              size: nil
            }
          end
          it { expect { result }.to raise_error InvalidFormatError }
        end

        context "with other types of value" do
          let(:value) { "xxx" }
          it { expect { result }.to raise_error InvalidFormatError }
        end
      end
    end
  end
end
