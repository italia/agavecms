require "rails_helper"

module Agave
  module Validator
    RSpec.describe Unique do
      subject(:validator) { described_class.new(validator_field) }

      let(:field) do
        create(
          :field,
          api_key: "string",
          field_type: "string",
          appeareance: { type: "plain" }
        )
      end

      let(:localized_field) do
        create(
          :field,
          item_type: item_type,
          api_key: "text",
          field_type: "text",
          localized: true,
          appeareance: { type: "plain" }
        )
      end

      let(:item_type) { field.item_type }

      let(:matching_item) do
        create(
          :item,
          item_type: item_type,
          data: {
            field.id.to_s => existing_value,
            localized_field.id.to_s => {
              it: existing_value
            }
          }
        )
      end

      let(:existing_value) { "foobar" }

      describe "#call" do
        context "localized" do
          let(:validator_field) { localized_field }

          context "with a unique value" do
            it "returns true" do
              expect(validator.call("foobar", "it", nil)).to be_truthy
            end
          end

          context "with a non-unique value" do
            before { matching_item }

            context "with nil" do
              let(:existing_value) { nil }

              it "returns true" do
                expect(validator.call(nil, "it", nil)).to be_truthy
              end
            end

            context "with nil" do
              let(:existing_value) { "" }

              it "returns true" do
                expect(validator.call("", "it", nil)).to be_truthy
              end
            end

            context "with non-nil" do
              it "returns false" do
                expect(validator.call("foobar", "it", nil)).to be_falsy
              end
            end
          end
        end

        context "non-localized" do
          let(:validator_field) { field }

          context "with a unique value" do
            it "returns true" do
              expect(validator.call("foobar", nil, nil)).to be_truthy
            end
          end

          context "with a non-unique value" do
            before { matching_item }

            it "returns false" do
              expect(validator.call("foobar", nil, nil)).to be_falsy
            end
          end
        end
      end
    end
  end
end
