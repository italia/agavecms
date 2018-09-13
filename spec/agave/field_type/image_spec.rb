require "rails_helper"

module Agave
  module FieldType
    RSpec.describe Agave::FieldType::Image do
      subject(:field_type) { described_class.new(field) }
      let(:field) { build(:field) }

      describe "#load" do
        subject(:result) do
          field_type.load(value)
        end

        context "with an image hash" do
          let(:value) do
            {
              path: "foobar.jpg",
              width: 30,
              height: 30,
              format: "JPG",
              size: 500,
              alt: "",
              caption: ""
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

        context "with a invalid format" do
          let(:value) do
            {
              path: "foobar.pdf",
              width: 30,
              height: 30,
              format: "pdf",
              size: 500,
              alt: "alt",
              caption: "caption"
            }
          end
          it { expect { result }.to raise_error InvalidFormatError }
        end

        context "with missing values" do
          let(:value) do
            {
              path: "foobar.jpg",
              width: nil,
              height: 30,
              format: "jpg",
              size: 500,
              alt: "alt",
              caption: "caption"
            }
          end
          it { expect { result }.to raise_error InvalidFormatError }
        end

        context "SVGs" do
          let(:value) do
            {
              path: "foobar.svg",
              width: nil,
              height: nil,
              format: "svg",
              size: 500,
              alt: "alt",
              caption: "caption"
            }
          end

          it { expect { result }.not_to raise_error }
        end

        context "with other types of value" do
          let(:value) { "xxx" }
          it { expect { result }.to raise_error InvalidFormatError }
        end
      end
    end
  end
end
