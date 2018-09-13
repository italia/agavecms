require "rails_helper"

module ItemMigration
  RSpec.describe AddField do
    subject(:command) { described_class.new(field) }

    let(:field) do
      create(
        :field,
        item_type: item_type,
        localized: localized
      )
    end
    let(:localized) { false }

    let(:item_type) { create(:item_type, site: site) }
    let(:site) { create(:site, locales: site_locales) }
    let(:site_locales) { ["it", "en"] }
    let(:item) { create(:item, item_type: item_type) }
    let(:updated_at) { DateTime.new(2010, 1, 1) }

    describe "#call" do
      before do
        Timecop.freeze(updated_at) do
          item
        end
      end

      before do
        command.call
        item.reload
      end

      it "does not change updated_at" do
        expect(item.updated_at).to eq updated_at
      end

      context "when field is not localized" do
        let(:localized) { false }

        it "set the field with a null value" do
          expect(item.data[field.id.to_s]).to eq nil
        end
      end

      context "when field is localized" do
        let(:localized) { true }

        it "set the field with a null value for each locale" do
          site_locales.each do |locale|
            expect(item.data[field.id.to_s][locale]).to eq nil
          end
        end
      end
    end
  end
end
