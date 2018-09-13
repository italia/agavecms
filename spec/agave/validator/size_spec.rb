require "rails_helper"

module Agave
  module Validator
    RSpec.describe Size do
      subject(:validator) { described_class.new(field, options) }
      let(:field) { create(:field) }

      context "with invalid option keys" do
        let(:options) { {} }

        it "raises an ArgumentError" do
          expect { validator }.to raise_error ArgumentError
        end
      end

      expectations = [
        [{ min: 4 }, nil, false],

        [{ min: 4 }, "xxx", false],
        [{ min: 4 }, "xxxx", true],
        [{ min: 4 }, "xxxxx", true],

        [{ max: 4 }, "xxxxx", false],
        [{ max: 4 }, "xxxx", true],
        [{ max: 4 }, "xxx", true],
        [{ max: 4 }, "", true],
        [{ max: 4 }, nil, true],

        [{ eq: 4 }, "xxx", false],
        [{ eq: 4 }, "xxxx", true],

        [{ min: 2, max: 4 }, "x", false],
        [{ min: 2, max: 4 }, "xx", true],
        [{ min: 2, max: 4 }, "xxxx", true],
        [{ min: 2, max: 4 }, "xxxxx", false],

        [{ min: 4 }, %w(x x x), false],
        [{ min: 4 }, %w(x x x x), true],
        [{ min: 4 }, %w(x x x x x), true]
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
