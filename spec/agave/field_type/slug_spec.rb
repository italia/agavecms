require "rails_helper"

module Agave
  module FieldType
    RSpec.describe Agave::FieldType::Slug do
      subject(:field_type) do
        described_class.new(
          field,
          {},
          title_field_id: title_field.id.to_s,
          url_prefix: nil
        )
      end

      let(:field) { create(:field) }

      let(:title_field) do
        create(
          :field,
          item_type: field.item_type,
          field_type: "string",
          appeareance: { type: "title" }
        )
      end

      describe "#load" do
        subject(:result) do
          field_type.load(value)
        end

        context "with strings" do
          let(:value) { "123-foo-bar-123" }
          it { is_expected.to eq "123-foo-bar-123" }
        end

        context "with trailing dashes" do
          let(:value) { "foo-" }
          it { expect { result }.to raise_error InvalidFormatError }
        end

        context "with double dashes" do
          let(:value) { "foo--bar" }
          it { expect { result }.to raise_error InvalidFormatError }
        end

        context "with leading dashes" do
          let(:value) { "-foo" }
          it { expect { result }.to raise_error InvalidFormatError }
        end

        context "with uppercase" do
          let(:value) { "FOO" }
          it { expect { result }.to raise_error InvalidFormatError }
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
