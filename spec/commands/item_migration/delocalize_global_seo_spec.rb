require "rails_helper"

module ItemMigration
  RSpec.describe DelocalizeGlobalSeo do
    subject(:command) { described_class.new(site) }

    let(:site) do
      create(
        :site,
        locales: site_locales,
        global_seo: global_seo_attributes
      )
    end
    let(:site_locales) { ["it", "en"] }
    let(:updated_at) { DateTime.new(2010, 1, 1) }

    let(:global_seo_attributes) do
      {
        en: {
          site_name: "My Site",
          fallback_seo: {
            title: "Title",
            description: "Description"
          }
        },
        it: {
          site_name: "Mio sito",
          fallback_seo: {
            title: "Titolo",
            description: "Descrizione"
          }
        }
      }.deep_stringify_keys
    end

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
        expect(site.global_seo).to eq global_seo_attributes["it"]
      end

      it "does not change updated_at" do
        expect(site.updated_at).to eq updated_at
      end
    end
  end
end
