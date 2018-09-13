require "rails_helper"

module Agave
  module Validator
    RSpec.describe NumberRange do
      subject(:validator) { described_class.new(field, options) }
      let(:field) { create(:field) }

      context "with missing option keys" do
        let(:options) { {} }

        it "raises an ArgumentError" do
          expect { validator }.to raise_error ArgumentError
        end
      end

      context "if max is less then min" do
        let(:options) { { min: 2, max: 1 } }

        it "raises an ArgumentError" do
          expect { validator }.to raise_error ArgumentError
        end
      end

      expectations = [
        [{ min: 1 }, 2, true],
        [{ min: 1 }, 0, false],

        [{ max: 1 }, 1, true],
        [{ max: 1 }, 2, false],

        [{ min: 1, max: 3 }, 0, false],
        [{ min: 1, max: 3 }, 1, true],
        [{ min: 1, max: 3 }, 2, true],
        [{ min: 1, max: 3 }, 3, true],
        [{ min: 1, max: 3 }, 4, false],

        [{ min: 2, max: 2 }, 1, false],
        [{ min: 2, max: 2 }, 2, true],
        [{ min: 2, max: 2 }, 3, false]
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
