require "rails_helper"

module ItemMigration
  RSpec.describe ChangeItemTypeLocales do
    subject(:command) do
      described_class.new(item_type, to_add, to_keep, ["fr"])
    end

    let(:item_type) do
      create(:item_type)
    end

    let(:localized_field_a) do
      create(:field, item_type: item_type, localized: true)
    end

    let(:localized_field_b) do
      create(:field, item_type: item_type, field_type: Agave::FieldType::Image.code, localized: true)
    end

    let(:nonlocalized_field) do
      create(:field, item_type: item_type, localized: false)
    end

    let(:item) do
      create(:item, item_type: item_type, data: item_data)
    end

    let(:item_data) do
      {
        localized_field_a.id.to_s => { "it" => "it_a", "fr" => "fr_a" },
        localized_field_b.id.to_s => {
          "it" => item_upload_it.id.to_s,
          "fr" => item_upload_fr.id.to_s
        },
        nonlocalized_field.id.to_s => "c"
      }
    end

    let(:item_upload_it) do
      create(:item_upload, upload: upload_it)
    end

    let(:upload_it) do
      create(:upload, site: item_type.site)
    end

    let(:item_upload_fr) do
      create(:item_upload, upload: upload_fr)
    end

    let(:upload_fr) do
      create(:upload, site: item_type.site)
    end

    let(:updated_at) do
      DateTime.new(2010, 1, 1)
    end

    before do
      localized_field_a
      localized_field_b
      nonlocalized_field

      Timecop.freeze(updated_at) do
        item
      end
    end

    describe "#call" do
      before do
        command.call
        item.reload
      end

      let(:to_add) do
        ["en"]
      end

      let(:to_keep) do
        ["it"]
      end

      it "migrates localized fields data" do
        expect(item.data).to eq(
          localized_field_a.id.to_s => { "it" => "it_a", "en" => nil },
          localized_field_b.id.to_s => { "it" => item_upload_it.id.to_s, "en" => nil },
          nonlocalized_field.id.to_s => "c"
        )
      end

      it "deletes orphan ItemUploads" do
        expect(ItemUpload.find_by_id(item_upload_fr.id)).to be_nil
      end

      it "preserves updated_at" do
        expect(item.updated_at).to eq updated_at
      end
    end
  end
end
