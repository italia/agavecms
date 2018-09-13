require "rails_helper"

module Agave
  module Validator
    RSpec.describe Format do
      subject(:validator) { described_class.new(field, options) }
      let(:field) { create(:field) }

      context "with extra keys" do
        let(:options) { { foobar: true, predefined_pattern: "email" } }

        it "raises an ArgumentError" do
          expect { validator }.to raise_error ArgumentError
        end
      end

      context "with no custom or predefined pattern" do
        let(:options) { {} }

        it "raises an ArgumentError" do
          expect { validator }.to raise_error ArgumentError
        end
      end

      context "with predefined pattern" do
        context "with empty predefined_pattern" do
          let(:options) { { predefined_pattern: "" } }

          it "raises an ArgumentError" do
            expect { validator }.to raise_error ArgumentError
          end
        end

        context "with invalid predefined_pattern" do
          let(:options) { { predefined_pattern: "foobar" } }

          it "raises an ArgumentError" do
            expect { validator }.to raise_error ArgumentError
          end
        end

        context "email pattern" do
          let(:options) { { predefined_pattern: "email" } }

          context "#call" do
            context "with valid values" do
              it "returns true" do
                expect(validator.call("foo@bar.com", nil, nil)).to be_truthy
              end
            end

            context "with invalid email" do
              it "returns false" do
                expect(validator.call("foobar", nil, nil)).to be_falsey
              end
            end
          end
        end

        context "url pattern" do
          let(:options) { { predefined_pattern: "url" } }

          context "#call" do
            context "with valid values" do
              it "returns true" do
                expect(validator.call("http://www.google.com", nil, nil)).to be_truthy
                expect(validator.call("https://www.google.com/foo", nil, nil)).to be_truthy
              end
            end

            context "with invalid values" do
              it "returns false" do
                expect(validator.call("ftp://www.google.com", nil, nil)).to be_falsey
                expect(validator.call("//www.google.com", nil, nil)).to be_falsey
                expect(validator.call("www.google.com", nil, nil)).to be_falsey
                expect(validator.call("/bar/com", nil, nil)).to be_falsey
              end
            end
          end
        end
      end

      context "with custom pattern" do
        context "with empty custom_pattern" do
          let(:options) { { custom_pattern: "" } }

          it "raises an ArgumentError" do
            expect { validator }.to raise_error ArgumentError
          end
        end

        context "with invalid custom_pattern" do
          let(:options) { { custom_pattern: "[\w-\/]" } }

          it "raises an ArgumentError" do
            expect { validator }.to raise_error ArgumentError
          end
        end

        expectations = [
          [{ custom_pattern: "foo" }, "foo", true],
          [{ custom_pattern: "baz" }, "foo", false],
          [{ custom_pattern: "^foo" }, "afoo", false],
          [{ custom_pattern: "^foo" }, "foobar", true],
          [{ custom_pattern: "foo$" }, "foob", false],
          [{ custom_pattern: "foo$" }, "abcfoo", true]
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
end
