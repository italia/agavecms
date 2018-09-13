require "rails_helper"

module Agave
  module Validator
    RSpec.describe Required do
      subject(:validator) { described_class.new(field) }
      let(:field) { build(:field) }

      expectations = [
        [nil, false],
        ["", false],
        [[], false],
        [{}, false],
        [0, true],
        [1, true],
        ["foo", true],
        [[1], true],
        [{ foo: "bar" }, true]
      ]

      describe "#call" do
        expectations.each do |(value, expected_value)|
          context "with \"#{value}\"" do
            it "returns #{expected_value}" do
              expect(validator.call(value, nil, nil)).to be(expected_value)
            end
          end
        end
      end
    end
  end
end
