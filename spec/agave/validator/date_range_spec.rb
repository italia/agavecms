require "rails_helper"

module Agave
  module Validator
    RSpec.describe DateRange do
      subject(:validator) { described_class.new(field, options) }
      let(:field) { create(:field) }

      context "with invalid option keys" do
        let(:options) { {} }

        it "raises an ArgumentError" do
          expect { validator }.to raise_error ArgumentError
        end
      end

      [:min, :max].each do |option_key|
        context "on attribute \"#{option_key}\"" do
          context "with data not in iso8601 format" do
            let(:options) { { option_key => "2015/01/01" } }

            it "raises an ArgumentError" do
              expect { validator }.to raise_error ArgumentError
            end
          end
        end
      end

      context "if max is less then min" do
        let(:options) { { min: "2000-01-02", max: "2000-01-01" } }

        it "raises an ArgumentError" do
          expect { validator }.to raise_error ArgumentError
        end
      end

      expectations = [
        [{ min: "2000-01-01" }, nil, true],

        [{ min: "2000-01-01" }, "2000-01-01", true],
        [{ min: "2000-01-02" }, "2000-01-01", false],

        [{ max: "2000-01-01" }, "2000-01-01", true],
        [{ max: "1999-12-31" }, "2000-01-01", false],

        [{ min: "1999-12-31", max: "2000-01-02" }, "1999-12-31", true],
        [{ min: "1999-12-31", max: "2000-01-02" }, "2000-01-01", true],
        [{ min: "1999-12-31", max: "2000-01-02" }, "2000-01-02", true],

        [{ min: "1999-12-31", max: "2000-01-02" }, "2000-01-03", false],
        [{ min: "1999-12-31", max: "2000-01-02" }, "1999-12-30", false],

        [{ min: "2000-01-01", max: "2000-01-01" }, "1999-12-31", false],
        [{ min: "2000-01-01", max: "2000-01-01" }, "2000-01-01", true],
        [{ min: "2000-01-01", max: "2000-01-01" }, "2000-01-02", false]
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
