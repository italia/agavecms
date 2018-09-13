require "rails_helper"

RSpec.describe CreateItem do
  subject(:command) { described_class.new(site, payload) }

  let(:site) { create(:site) }
  let(:payload) do
    {
      data: {
        type: "item",
        attributes: attributes,
        relationships: {
          item_type: {
            data: {
              type: "item_type",
              id: item_type_id
            }
          }
        }
      }
    }
  end
  let(:item_type_id) { "1231231" }
  let(:attributes) do
    {
      title: "foo bar",
      cover_image: {
        path: "foobar.jpg",
        width: 30,
        height: 30,
        format: "JPG",
        size: 500,
        alt: "",
        caption: ""
      },
      position: 2
    }
  end

  describe "#call" do
    context "with a non-existing type" do
      it "throws an InvalidData error" do
        expect { command.call }.to raise_error { |ex|
          expect(ex.errors.first.code).to eq "INVALID_TYPE"
        }
      end
    end

    context "with an existing type" do
      let(:item_type) do
        create(:item_type, site: site, sortable: true)
      end

      let(:item_type_id) { item_type.id.to_s }

      let(:field) do
        create(
          :field,
          item_type: item_type,
          api_key: "title",
          validators: {}
        )
      end

      let(:image_field) do
        create(
          :field,
          item_type: item_type,
          field_type: "image",
          api_key: "cover_image",
          validators: {}
        )
      end

      before do
        item_type
        field
        image_field
      end

      it "creates a new item" do
        item = command.call
        item_upload = item.reload.item_uploads.first

        expect(item).to be_a Item
        expect(item.item_type).to eq item_type
        expect(item.data[field.id.to_s]).to eq "foo bar"
        expect(item.data[image_field.id.to_s]).to eq item_upload.id.to_s
        expect(item.position).to eq 1

        expect(item_upload.item).to eq item
        expect(item_upload.field).to eq image_field
        expect(item_upload.locale).to eq nil
        expect(item_upload.upload.path).to eq "foobar.jpg"
      end

      context "with correct localized payload" do
        let(:site) { create(:site, locales: %w(it en)) }
        let(:notifier) { instance_double("NotifySiteChange", call: true) }

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

        let(:image_field) do
          create(
            :field,
            item_type: item_type,
            field_type: "image",
            api_key: "cover_image",
            localized: true,
            validators: {}
          )
        end

        let(:attributes) do
          {
            title: {
              it: "antani",
              en: "foo bar"
            },
            cover_image: {
              it: {
                path: "foobar.jpg",
                width: 30,
                height: 30,
                format: "JPG",
                size: 500,
                alt: "",
                caption: ""
              },
              en: nil
            },
            position: 2
          }
        end

        before do
          allow(NotifySiteChange).to receive(:new).with(site) { notifier }
        end

        before do
          @item = command.call
        end

        it "creates a new item" do
          item_upload = @item.reload.item_uploads.first

          expect(@item).to be_a Item
          expect(@item.item_type).to eq item_type
          expect(@item.data[field.id.to_s]["it"]).to eq "antani"
          expect(@item.data[field.id.to_s]["en"]).to eq "foo bar"
          expect(@item.data[image_field.id.to_s]["it"]).to eq item_upload.id.to_s
          expect(@item.position).to eq 1

          expect(item_upload.item).to eq @item
          expect(item_upload.field).to eq image_field
          expect(item_upload.locale).to eq "it"
          expect(item_upload.upload.path).to eq "foobar.jpg"
        end

        it "touches the site" do
          expect(notifier).to have_received(:call)
        end
      end

      context "if the content-type is a singleton and a item is already created" do
        let(:item_type) do
          create(
            :item_type,
            site: site,
            api_key: "post",
            singleton: true
          )
        end
        let(:item) do
          create(
            :item,
            item_type: item_type
          )
        end

        before do
          item
          item_type.update_attributes(singleton_item: item)
        end

        it "throws an InvalidData error" do
          expect { command.call }.to raise_error { |ex|
            expect(ex.errors.first.code).to eq "DUPLICATE_SINGLETON"
          }
        end
      end
    end
  end
end
