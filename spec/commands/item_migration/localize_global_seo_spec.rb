require "rails_helper"

module ItemMigration
  RSpec.describe LocalizeGlobalSeo do
    subject(:command) { described_class.new(site, false) }

    let(:site) do
      create(
        :site,
        locales: site_locales,
        global_seo: global_seo_attributes
      )
    end

    let(:site_locales) { ["it", "en"] }

    let(:global_seo_attributes) do
      {
        site_name: "My Site",
        fallback_seo: {
          title: "Title",
          description: "Description"
        }
      }.deep_stringify_keys
    end

    let(:updated_at) { DateTime.new(2010, 1, 1) }

    describe "#call" do
      before do
        Timecop.freeze(updated_at) do
          site
        end
      end

      before do
        command.call
        site.reload
      end

      it "moves value for default locale as default value" do
        expect(site.global_seo).to eq("it" => global_seo_attributes, "en" => nil)
      end

      it "does not change updated_at" do
        expect(site.updated_at).to eq updated_at
      end
    end
  end
end
