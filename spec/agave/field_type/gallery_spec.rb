require "rails_helper"

module Agave
  module FieldType
    RSpec.describe Agave::FieldType::Gallery do
      subject(:field_type) { described_class.new(field) }
      let(:field) { build(:field) }

      describe "#load" do
        subject(:result) do
          field_type.load(value)
        end

        context "with an image array" do
          let(:value) do
            [
              {
                path: "foobar.jpg",
                width: 30,
                height: 30,
                format: "JPG",
                size: 500,
                alt: "",
                title: ""
              }
            ]
          end

          it "normalizes format" do
            expect(result.first["format"]).to eq "jpg"
          end
        end

        context "with nil" do
          let(:value) { nil }
          it { is_expected.to eq nil }
        end

        context "with invalid value" do
          let(:value) { "xxx" }
          it { expect { result }.to raise_error InvalidFormatError }
        end

        context "with a invalid format" do
          let(:value) do
            [
              {
                path: "foobar.pdf",
                width: 30,
                height: 30,
                format: "pdf",
                size: 500,
                alt: "",
                title: ""
              }
            ]
          end
          it { expect { result }.to raise_error InvalidFormatError }
        end

        context "with missing values" do
          let(:value) do
            [
              {
                path: "foobar.jpg",
                width: nil,
                height: 30,
                format: "jpg",
                size: 500,
                alt: "",
                title: ""
              }
            ]
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
