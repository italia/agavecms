require "rails_helper"

module Agave
  module FieldType
    RSpec.describe Agave::FieldType::Text do
      subject(:field_type) { described_class.new(field, {}, type: "plain") }
      let(:field) { build(:field) }

      describe "#load" do
        subject(:result) do
          field_type.load(value)
        end

        context "with strings" do
          let(:value) { "foo" }
          it { is_expected.to eq "foo" }
        end

        context "with nil" do
          let(:value) { nil }
          it { is_expected.to eq nil }
        end

        context "with other types of value" do
          let(:value) { 12 }
          it { expect { result }.to raise_error InvalidFormatError }
        end
      end
    end
  end
end
