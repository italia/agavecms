require "rails_helper"

RSpec.describe UpdateItem do
  subject(:command) { described_class.new(item, payload) }

  let(:item) do
    create(
      :item,
      item_type: item_type,
      data: {
        text_field.id.to_s => "old title",
        datetime_field.id.to_s => nil
      },
      position: 2
    )
  end

  let(:item_upload) do
    create(
      :item_upload,
      item: item,
      upload: upload,
      field: image_field
    )
  end

  let(:upload) do
    create(:upload, site: site)
  end

  let(:existing_item_1) do
    create(
      :item,
      item_type: item_type,
      data: {
        text_field.id.to_s => "old title",
        datetime_field.id.to_s => nil
      },
      position: 1
    )
  end

  let(:existing_item_2) do
    create(
      :item,
      item_type: item_type,
      data: {
        text_field.id.to_s => "old title",
        datetime_field.id.to_s => nil
      },
      position: 3
    )
  end

  let(:item_type) do
    create(:item_type, site: site, api_key: "post", sortable: true)
  end

  let(:site) { create(:site) }

  let(:payload) do
    { data: { attributes: attributes } }
  end

  let(:attributes) do
    {
      title: "foo bar",
      published_at: "2014-01-01T12:30+02:00",
      cover_image: {
        path: "foobar.jpg",
        width: 30,
        height: 30,
        format: "JPG",
        size: 500,
        alt: "",
        caption: ""
      },
      position: 1
    }
  end

  let(:text_field) do
    create(
      :field,
      item_type: item_type,
      api_key: "title",
      validators: {}
    )
  end

  let(:datetime_field) do
    create(
      :field,
      item_type: item_type,
      field_type: "date_time",
      api_key: "published_at",
      validators: {},
      appeareance: {}
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
    existing_item_1
    existing_item_2
    item_type
    text_field
    datetime_field
    image_field
    item_upload
    item
    item.update_attributes!(data: item.data.merge(
      image_field.id.to_s => item_upload.id.to_s
    ))
  end

  describe "#call" do
    it "updates the item, creates uploads and reorders positions" do
      returned_item = command.call

      expect(ItemUpload.where(id: item_upload.id).first).to be_nil

      item_uploads = returned_item.reload.item_uploads

      expect(item_uploads.count).to eq 1

      new_item_upload = returned_item.reload.item_uploads.first

      expect(returned_item.id).to eq item.id
      expect(returned_item.data[text_field.id.to_s]).to eq "foo bar"
      expect(returned_item.data[datetime_field.id.to_s]).to eq "2014-01-01T12:30:00+00:00"
      expect(returned_item.data[image_field.id.to_s]).to eq new_item_upload.id.to_s
      expect(returned_item.position).to eq 1

      expect(existing_item_1.reload.position).to eq 2
      expect(existing_item_2.reload.position).to eq 3

      expect(new_item_upload.item).to eq returned_item
      expect(new_item_upload.field).to eq image_field
      expect(new_item_upload.locale).to eq nil
      expect(new_item_upload.upload.path).to eq "foobar.jpg"
    end

    context "with no attributes" do
      let(:attributes) do
        {}
      end

      it "keeps item untouched" do
        returned_item = command.call

        expect(returned_item.id).to eq item.id
        expect(returned_item.data[text_field.id.to_s]).to eq "old title"
        expect(returned_item.data[datetime_field.id.to_s]).to be_nil
        expect(returned_item.data[image_field.id.to_s]).to eq item_upload.id.to_s
        expect(returned_item.position).to eq 2
      end
    end

    context "with correct localized payload" do
      let(:notifier) { instance_double("NotifySiteChange", call: true) }

      let(:site) { create(:site, locales: %w(it en)) }

      let(:item) do
        create(
          :item,
          item_type: item_type,
          data: {
            text_field.id.to_s => {
              it: "vecchio titolo",
              en: "old title"
            },
            datetime_field.id.to_s => nil
          },
          position: 2
        )
      end

      let(:existing_item_1) do
        create(
          :item,
          item_type: item_type,
          data: {
            text_field.id.to_s => {
              it: "vecchio titolo",
              en: "old title"
            },
            datetime_field.id.to_s => nil
          },
          position: 1
        )
      end
      let(:existing_item_2) do
        create(
          :item,
          item_type: item_type,
          data: {
            text_field.id.to_s => {
              it: "vecchio titolo",
              en: "old title"
            },
            datetime_field.id.to_s => nil
          },
          position: 3
        )
      end

      let(:text_field) do
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
            en: "foo bar"
          },
          position: 1
        }
      end

      before do
        allow(NotifySiteChange).to receive(:new).with(site) { notifier }
      end

      before do
        @item = command.call
      end

      it "updates the item" do
        expect(@item).to be_a Item
        expect(@item.item_type).to eq item_type
        expect(@item.data[text_field.id.to_s]["it"]).to eq "antani"
        expect(@item.data[text_field.id.to_s]["en"]).to eq "foo bar"
        expect(@item.position).to eq 1
      end

      it "touches the site" do
        expect(notifier).to have_received(:call)
      end
    end

    context "tree" do
      let(:notifier) { instance_double("NotifySiteChange", call: true) }

      let(:site) { create(:site, locales: %w(it en)) }

      let(:item_type) do
        create(
          :item_type,
          site: site,
          api_key: "post",
          tree: true
        )
      end

      let(:item) do
        create(
          :item,
          item_type: item_type,
          data: {
            text_field.id.to_s => "Item",
            datetime_field.id.to_s => nil
          },
          position: 1,
          parent: root_item_1
        )
      end

      let(:root_item_1) do
        create(
          :item,
          item_type: item_type,
          data: {
            text_field.id.to_s => "Root 1",
            datetime_field.id.to_s => nil
          },
          position: 1
        )
      end

      let(:root_item_2) do
        create(
          :item,
          item_type: item_type,
          data: {
            text_field.id.to_s => "Root 2",
            datetime_field.id.to_s => nil
          },
          position: 2
        )
      end

      let(:child_1) do
        create(
          :item,
          item_type: item_type,
          data: {
            text_field.id.to_s => "Child 1",
            datetime_field.id.to_s => nil
          },
          position: 2,
          parent: root_item_1
        )
      end

      let(:child_2) do
        create(
          :item,
          item_type: item_type,
          data: {
            text_field.id.to_s => "Child 2",
            datetime_field.id.to_s => nil
          },
          position: 1,
          parent: root_item_2
        )
      end

      let(:attributes) do
        {
          title: "Item update",
          position: 1,
          parent_id: root_item_2.id.to_s
        }
      end

      before do
        allow(NotifySiteChange).to receive(:new).with(site) { notifier }
      end

      before do
        root_item_1
        root_item_2
        child_1
        child_2
        @item = command.call
      end

      it "updates the item" do
        expect(@item.position).to eq 1
        expect(@item.parent).to eq root_item_2

        expect(child_2.reload.position).to eq 2
        expect(child_1.reload.position).to eq 1
      end
    end
  end
end
