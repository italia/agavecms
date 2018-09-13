require "rails_helper"

module ItemMigration
  RSpec.describe LocalizeField do
    subject(:command) { described_class.new(field) }

    let(:field) { create(:field, item_type: item_type) }
    let(:item_type) { create(:item_type, site: site) }
    let(:site) { create(:site, locales: site_locales) }
    let(:site_locales) { ["it", "en"] }
    let(:updated_at) { DateTime.new(2010, 1, 1) }

    let(:item) do
      create(
        :item,
        item_type: item_type,
        data: item_attributes
      )
    end

    let(:item_attributes) do
      {
        field.id.to_s => "a value"
      }
    end

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

      it "moves value for default locale as default value" do
        expect(item.data[field.id.to_s]).to eq("it" => "a value", "en" => nil)
      end

      it "does not change updated_at" do
        expect(item.updated_at).to eq updated_at
      end
    end
  end
end
