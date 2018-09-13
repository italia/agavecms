require "rails_helper"

RSpec.describe UpdateSite do
  subject(:command) { described_class.new(site, payload, role) }

  let(:role) { Role::Value.new(Authenticator::READONLY_TOKEN_ROLE) }

  let(:site) do
    create(
      :site,
      no_index: false,
      global_seo: nil,
      theme: {
        primary_color: { red: 10, green: 10, blue: 10, alpha: 255 },
        light_color: { red: 10, green: 10, blue: 10, alpha: 255 },
        accent_color: { red: 10, green: 10, blue: 10, alpha: 255 },
        dark_color: { red: 10, green: 10, blue: 10, alpha: 255 },
        logo: nil
      }
    )
  end

  let(:payload) do
    { data: { attributes: attributes } }
  end

  describe "#call" do
    let(:notifier) { instance_double("NotifySiteChange", call: true) }

    let(:attributes) do
      {
        no_index: true,
        favicon: {
          path: "foobar.jpg",
          width: 30,
          height: 30,
          format: "jpg",
          size: 500
        },
        global_seo: {
          site_name: "Foo",
          title_suffix: nil,
          twitter_account: nil,
          facebook_page_url: nil,
          fallback_seo: {
            title: "Foo",
            description: "Bar"
          }
        }
      }
    end

    before do
      allow(NotifySiteChange).to receive(:new).with(site) { notifier }
    end

    context "attributes" do
      before do
        command.call
      end

      it "updates the site" do
        expect(site.no_index).to be_truthy
        expect(site.favicon["path"]).to eq "foobar.jpg"
        expect(site.global_seo["fallback_seo"]["title"]).to eq "Foo"
      end

      it "touches the site" do
        expect(notifier).to have_received(:call)
      end
    end

    context "attributes not allowed for current user" do
      let(:attributes) do
        { name: "New Site Wiii" }
      end

      it "throws an InvalidData error" do
        expect { command.call }.to raise_error(InvalidRecordError) { |ex|
          expect(ex.errors.first.code).to eq "INVALID_ATTRIBUTES"
        }
      end
    end

    context "admin user" do
      let(:role) { Role::Value.new(Authenticator::ADMIN_ROLE) }

      let(:attributes) do
        {
          name: "New Site Wiii",
          theme: {
            primary_color: { red: 20, green: 10, blue: 10, alpha: 255 },
            light_color: { red: 10, green: 10, blue: 10, alpha: 255 },
            accent_color: { red: 10, green: 10, blue: 10, alpha: 255 },
            dark_color: { red: 10, green: 10, blue: 10, alpha: 255 },
            logo: nil
          }
        }
      end

      before do
        command.call
      end

      it "updates attributes" do
        expect(site.theme["primary_color"]["red"]).to eq 20
        expect(site.name).to eq "New Site Wiii"
      end
    end
  end
end
