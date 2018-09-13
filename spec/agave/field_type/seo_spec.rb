require "rails_helper"

module Agave
  module FieldType
    RSpec.describe Agave::FieldType::Seo do
      subject(:field_type) { described_class.new(field) }
      let(:field) { build(:field) }

      let(:title) { "Foo" }
      let(:description) { "Bar" }
      let(:image) do
        {
          path: "foobar.jpg",
          width: width,
          height: height,
          format: format,
          size: 500
        }
      end
      let(:format) { "jpg" }
      let(:width) { 200 }
      let(:height) { 200 }

      let(:value) do
        {
          title: title,
          description: description,
          image: image
        }
      end

      describe "#load" do
        subject(:result) do
          field_type.load(value)
        end

        context "with a SEO hash" do
          context "with valid data" do
            it { is_expected.to be_a ::Hash }
          end

          context "with no image" do
            let(:image) { nil }
            it { is_expected.to be_a ::Hash }
          end

          context "with a title exceeding 55 chars" do
            let(:title) { "=" * 66 }
            it { expect { result }.to raise_error InvalidFormatError }
          end

          context "with a description exceeding 55 chars" do
            let(:description) { "=" * 161 }
            it { expect { result }.to raise_error InvalidFormatError }
          end

          context "with a malformed image payload" do
            let(:image) { { path: "foo" } }
            it { expect { result }.to raise_error InvalidFormatError }
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
