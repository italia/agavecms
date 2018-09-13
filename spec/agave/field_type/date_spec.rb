require "rails_helper"

module Agave
  module FieldType
    RSpec.describe Agave::FieldType::Date do
      subject(:field_type) { described_class.new(field) }
      let(:field) { build(:field) }

      describe "#load" do
        subject(:result) do
          field_type.load(value)
        end

        context "with iso 8601 strings" do
          let(:value) { "2014-01-01" }
          it { is_expected.to eq "2014-01-01" }
        end

        context "with nil" do
          let(:value) { nil }
          it { is_expected.to eq nil }
        end

        context "with empty string" do
          let(:value) { "" }
          it { is_expected.to eq nil }
        end

        context "with other types of value" do
          let(:value) { "12" }
          it { expect { result }.to raise_error InvalidFormatError }
        end
      end
    end
  end
end
