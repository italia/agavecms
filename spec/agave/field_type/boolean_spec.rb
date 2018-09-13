require "rails_helper"

module Agave
  module FieldType
    RSpec.describe Agave::FieldType::Boolean do
      subject(:field_type) { described_class.new(field) }
      let(:field) { build(:field) }

      describe ".load" do
        subject(:result) do
          field_type.load(value)
        end

        context "with true" do
          let(:value) { true }
          it { is_expected.to eq true }
        end

        context "with false" do
          let(:value) { false }
          it { is_expected.to eq false }
        end

        context "with nil" do
          let(:value) { nil }
          it { is_expected.to eq false }
        end

        context "with other data" do
          let(:value) { "foo" }
          it { expect { result }.to raise_error InvalidFormatError }
        end
      end
    end
  end
end
