require "rails_helper"

module Agave
  module Validator
    RSpec.describe FileSize do
      subject(:validator) { described_class.new(field, options) }
      let(:field) { create(:field) }

      context "with invalid option keys" do
        let(:options) { {} }

        it "raises an ArgumentError" do
          expect { validator }.to raise_error ArgumentError
        end
      end

      expectations = [
        [{ min_value: 4, min_unit: "MB" }, nil, true],
        [{ min_value: 4, min_unit: "MB" }, 3.megabytes, false],
        [{ min_value: 4, min_unit: "MB" }, 4.megabytes, true],
        [{ min_value: 4, min_unit: "MB" }, 5.megabytes, true],

        [{ max_value: 4, max_unit: "KB" }, 5.kilobytes, false],
        [{ max_value: 4, max_unit: "KB" }, 4.kilobytes, true],
        [{ max_value: 4, max_unit: "KB" }, 3.kilobytes, true],
        [{ max_value: 4, max_unit: "KB" }, nil, true],

        [{ min_value: 2, min_unit: "MB", max_value: 4, max_unit: "MB" }, 1.megabyte, false],
        [{ min_value: 2, min_unit: "MB", max_value: 4, max_unit: "MB" }, 2.megabytes, true],
        [{ min_value: 2, min_unit: "MB", max_value: 4, max_unit: "MB" }, 4.megabytes, true],
        [{ min_value: 2, min_unit: "MB", max_value: 4, max_unit: "MB" }, 5.megabytes, false]
      ]

      describe "#call" do
        expectations.each do |(options, value, expected_value)|
          context "with a size of \"#{value.inspect}\" and options #{options.inspect}" do
            let(:options) { options }

            it "returns #{expected_value}" do
              field_value = if value
                              { "size" => value }
                            end

              expect(validator.call(field_value, nil, nil)).to be(expected_value)
            end
          end
        end
      end
    end
  end
end
