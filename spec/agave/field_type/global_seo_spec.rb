require "rails_helper"

module Agave
  module FieldType
    RSpec.describe Agave::FieldType::GlobalSeo do
      subject(:field_type) { described_class.new(field) }
      let(:field) { build(:field) }

      let(:value) do
        {
          site_name: site_name,
          title_suffix: title_suffix,
          twitter_account: twitter_account,
          facebook_page_url: facebook_page_url,
          fallback_seo: seo
        }
      end
      let(:seo) do
        {
          title: "Foo",
          description: "Bar",
          image: image
        }
      end
      let(:site_name) { "My Site" }
      let(:title_suffix) { " - Foo bar" }
      let(:twitter_account) { "steffoz" }
      let(:facebook_page_url) { "http://google.com" }
      let(:image) do
        {
          path: "foobar.jpg",
          width: width,
          height: height,
          format: format,
          size: 500
        }
      end
      let(:format) { "JPG" }
      let(:width) { 200 }
      let(:height) { 200 }

      describe "#load" do
        subject(:result) do
          field_type.load(value)
        end

        context "with a hash" do
          context "with valid data" do
            it { is_expected.to be_a ::Hash }

            it "normalizes twitter account" do
              expect(result["twitter_account"]).to eq "@steffoz"
            end
          end

          context "with a title_suffix exceeding 25 chars" do
            let(:title_suffix) { "=" * 26 }
            it { expect { result }.to raise_error InvalidFormatError }
          end

          context "with a malformed facebook url" do
            let(:facebook_page_url) { "foo" }
            it { expect { result }.to raise_error InvalidFormatError }
          end

          context "with a malformed fallback_seo payload" do
            let(:seo) { { foo: "bar" } }
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
