require "rails_helper"

module Agave
  module FieldType
    RSpec.describe Agave::FieldType::LatLon do
      subject(:field_type) { described_class.new(field) }
      let(:field) { build(:field) }

      describe "#load" do
        subject(:result) do
          field_type.load(value)
        end

        context "with a latlon hash" do
          let(:value) do
            {
              latitude: latitude,
              longitude: longitude
            }
          end

          context "with missing latitude" do
            let(:latitude) { nil }
            let(:longitude) { 20 }
            it { expect { result }.to raise_error InvalidFormatError }
          end

          context "with missing longitude" do
            let(:latitude) { 10 }
            let(:longitude) { nil }
            it { expect { result }.to raise_error InvalidFormatError }
          end

          context "with valid data" do
            let(:longitude) { 20 }
            let(:latitude) { 10 }
            it { is_expected.to be_a ::Hash }
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

        context "with other types of value" do
          let(:value) { "xxx" }
          it { expect { result }.to raise_error InvalidFormatError }
        end
      end
    end
  end
end
