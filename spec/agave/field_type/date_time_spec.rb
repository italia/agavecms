require "rails_helper"

module Agave
  module FieldType
    RSpec.describe Agave::FieldType::DateTime do
      subject(:field_type) { described_class.new(field) }
      let(:field) { build(:field, item_type: item_type) }
      let(:item_type) { build(:item_type, site: site) }
      let(:site) { build(:site) }

      describe "#load" do
        subject(:result) do
          field_type.load(value)
        end

        context "with iso 8601 format" do
          context "with only date" do
            let(:value) { "2014-01-01" }
            it { is_expected.to be_a ::String }
            it { is_expected.to eq "2014-01-01T00:00:00+00:00" }
          end

          context "with a datetime and no timezone informations" do
            let(:value) { "2014-01-01T12:30" }
            it { is_expected.to be_a ::String }
            it { is_expected.to eq "2014-01-01T12:30:00+00:00" }
          end

          context "with a timezone" do
            let(:value) { "2014-01-01T12:30+02:00" }
            it { is_expected.to be_a ::String }
            it { is_expected.to eq "2014-01-01T12:30:00+00:00" }
          end
        end

        context "with nil" do
          let(:value) { nil }
          it { is_expected.to eq nil }
        end

        context "with other types of value" do
          let(:value) { "12" }
          it { expect { result }.to raise_error InvalidFormatError }
        end
      end

      describe "#dump" do
        subject(:result) do
          field_type.dump(value)
        end
        let(:site) { build(:site, timezone: "Europe/Moscow") }

        context "converts the datetime into site timezone" do
          let(:value) { "2014-01-01T12:30:00+00:00" }

          it { is_expected.to be_a ::String }
          it { is_expected.to eq "2014-01-01T12:30:00+04:00" }
        end
      end
    end
  end
end
