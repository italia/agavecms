require "rails_helper"

module Agave
  module FieldType
    RSpec.describe Agave::FieldType::Video do
      subject(:field_type) { described_class.new(field) }
      let(:field) { build(:field) }

      describe "#load" do
        subject(:result) do
          field_type.load(value)
        end

        context "with a file hash" do
          let(:value) do
            {
              url: "http://google.com",
              width: 800,
              height: 600,
              thumbnail_url: "http://google.com",
              title: "Rickroll",
              provider: "youtube",
              provider_uid: "1231"
            }
          end

          it { is_expected.to be_a ::Hash }
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
              url: "http://google.com",
              width: nil,
              height: 600,
              thumbnail_url: "http://google.com",
              title: "Rickroll",
              provider: "youtube",
              provider_uid: "1231"
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
