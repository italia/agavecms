require "rails_helper"

module Agave
  module Validator
    RSpec.describe Enum do
      subject(:validator) { described_class.new(field, options) }
      let(:field) { instance_double("Field") }

      context "with invalid option keys" do
        let(:options) { {} }

        it "raises an ArgumentError" do
          expect { validator }.to raise_error ArgumentError
        end
      end

      context "with an empty array as value" do
        let(:options) { { values: [] } }

        it "raises an ArgumentError" do
          expect { validator }.to raise_error ArgumentError
        end
      end

      expectations = [
        [{ values: ["foo"] }, nil, true],
        [{ values: ["foo"] }, "foo", true],
        [{ values: ["foo"] }, "bar", false]
      ]

      describe "#call" do
        expectations.each do |(options, value, expected_value)|
          context "with \"#{value}\" and options #{options.inspect}" do
            let(:options) { options }

            it "returns #{expected_value}" do
              expect(validator.call(value, nil, nil)).to be(expected_value)
            end
          end
        end
      end
    end
  end
end
