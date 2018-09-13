require "rails_helper"

module Agave
  module FieldType
    RSpec.describe Agave::FieldType::Integer do
      subject(:field_type) { described_class.new(field) }
      let(:field) { build(:field) }

      describe "#load" do
        subject(:result) do
          field_type.load(value)
        end

        context "with integers" do
          let(:value) { 12 }
          it { is_expected.to eq 12 }
        end

        context "with nil" do
          let(:value) { nil }
          it { is_expected.to eq nil }
        end

        context "with floats" do
          let(:value) { 12.3 }
          it { expect { result }.to raise_error InvalidFormatError }
        end

        context "with float strings" do
          let(:value) { "12.5" }
          it { expect { result }.to raise_error InvalidFormatError }
        end

        context "with zero strings" do
          let(:value) { "0" }
          it { is_expected.to eq 0 }
        end

        context "with empty strings" do
          let(:value) { "" }
          it { is_expected.to eq nil }
        end

        context "with integer strings" do
          let(:value) { "12" }
          it { is_expected.to eq 12 }
        end

        context "with other strings" do
          let(:value) { "foo" }
          it { expect { result }.to raise_error InvalidFormatError }
        end
      end
    end
  end
end
