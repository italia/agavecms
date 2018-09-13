require "rails_helper"

RSpec.describe ItemValidator do
  subject(:validator) { described_class.new(item_type, attributes, item_id) }

  let(:item_type) do
    create(:item_type, site: site, api_key: "post")
  end

  let(:item_id) { 42 }

  before do
    item_type
    field
  end

  context "non-localized field" do
    let(:site) { create(:site) }

    let(:field) do
      create(
        :field,
        item_type: item_type,
        api_key: "title",
        validators: {
          length: { min: 3 }
        }
      )
    end

    let(:attributes) do
      {
        title: "foo bar"
      }
    end

    context "with non-existing fields" do
      let(:attributes) do
        super().merge(foo: "qux")
      end

      it "throws an InvalidData error" do
        expect { validator.call }.to raise_error { |ex|
          expect(ex.errors.first.code).to eq "INVALID_ATTRIBUTES"
        }
      end
    end

    context "with missing fields" do
      let(:attributes) do
        {}
      end

      it "does not throw an InvalidData error" do
        expect { validator.call }.not_to raise_error
      end
    end

    context "with an invalid format" do
      let(:attributes) do
        { title: 12 }
      end

      it "throws an InvalidData error" do
        expect { validator.call }.to raise_error { |ex|
          expect(ex.errors.first.code).to eq "INVALID_FIELD"
          expect(ex.errors.first.details[:field]).to eq "title"
          expect(ex.errors.first.details[:code]).to eq "INVALID_FORMAT"
          expect(ex.errors.first.details[:locale]).to be_nil
        }
      end
    end

    context "failing validations" do
      let(:attributes) do
        { title: "ci" }
      end

      it "throws an InvalidData error" do
        expect { validator.call }.to raise_error { |ex|
          expect(ex.errors.first.code).to eq "INVALID_FIELD"
          expect(ex.errors.first.details[:field]).to eq "title"
          expect(ex.errors.first.details[:locale]).to be_nil
          expect(ex.errors.first.details[:code]).to eq "VALIDATION_LENGTH"
        }
      end
    end
  end

  context "localized field" do
    let(:site) { create(:site, locales: %w(it en)) }

    let(:field) do
      create(
        :field,
        item_type: item_type,
        api_key: "title",
        localized: true,
        validators: {
          length: { min: 3 }
        }
      )
    end

    let(:attributes) do
      {
        title: {
          it: "antani",
          en: "foobar"
        }
      }
    end

    context "if the payload is not an hash" do
      let(:attributes) do
        { title: 12 }
      end

      it "throws an InvalidData error" do
        expect { validator.call }.to raise_error { |ex|
          expect(ex.errors.first.details[:field]).to eq "title"
          expect(ex.errors.first.code).to eq "INVALID_FIELD"
          expect(ex.errors.first.details[:code]).to eq "LOCALIZATION_HASH_REQUIRED"
        }
      end
    end

    context "if there are extraneous locales" do
      let(:attributes) do
        {
          title: {
            it: "antani",
            en: "foobar",
            fr: "foubaur"
          }
        }
      end

      it "throws an InvalidData error" do
        expect { validator.call }.to raise_error { |ex|
          expect(ex.errors.first.details[:field]).to eq "title"
          expect(ex.errors.first.code).to eq "INVALID_FIELD"
          expect(ex.errors.first.details[:code]).to eq "INVALID_LOCALES"
        }
      end
    end

    context "if there are missing locales" do
      let(:attributes) do
        {
          title: {
            it: "antani"
          }
        }
      end

      it "throws an InvalidData error" do
        expect { validator.call }.to raise_error { |ex|
          expect(ex.errors.first.code).to eq "INVALID_FIELD"
          expect(ex.errors.first.details[:field]).to eq "title"
          expect(ex.errors.first.details[:code]).to eq "INVALID_LOCALES"
        }
      end
    end

    context "invalid format" do
      let(:attributes) do
        {
          title: {
            it: 12,
            en: "foobar"
          }
        }
      end

      it "throws an InvalidData error" do
        expect { validator.call }.to raise_error { |ex|
          expect(ex.errors.first.code).to eq "INVALID_FIELD"
          expect(ex.errors.first.details[:field]).to eq "title"
          expect(ex.errors.first.details[:code]).to eq "INVALID_FORMAT"
          expect(ex.errors.first.details[:locale]).to eq "it"
        }
      end
    end

    context "failing validations" do
      let(:attributes) do
        {
          title: {
            it: "antani",
            en: "fo"
          }
        }
      end

      it "throws an InvalidData error" do
        expect { validator.call }.to raise_error { |ex|
          expect(ex.errors.first.code).to eq "INVALID_FIELD"
          expect(ex.errors.first.details[:field]).to eq "title"
          expect(ex.errors.first.details[:code]).to eq "VALIDATION_LENGTH"
          expect(ex.errors.first.details[:locale]).to eq "en"
        }
      end
    end
  end

  context "position" do
    let(:site) { create(:site) }
    let(:field) { nil }

    let(:attributes) do
      {
        position: 1
      }
    end

    context "sortable" do
      let(:item_type) do
        create(:item_type, site: site, api_key: "post", sortable: true)
      end

      it "accepts a position attribute" do
        expect { validator.call }.not_to raise_error
      end

      context "non integer value" do
        let(:attributes) do
          {
            position: "foo"
          }
        end

        it "throws an InvalidData error" do
          expect { validator.call }.to raise_error { |ex|
            expect(ex.errors.first.code).to eq "INVALID_POSITION"
          }
        end
      end
    end

    context "non sortable" do
      let(:item_type) do
        create(:item_type, site: site, api_key: "post", sortable: false)
      end

      it "does not accept a position attribute" do
        expect { validator.call }.to raise_error { |ex|
          expect(ex.errors.first.code).to eq "INVALID_ATTRIBUTES"
        }
      end
    end
  end
end
