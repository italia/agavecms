require "rails_helper"

RSpec.describe DestroyItemType do
  subject(:command) { described_class.new(item_type) }
  let(:item_type) { create(:item_type, site: site) }
  let(:site) { create(:site) }
  let(:another_item_type) { create(:item_type, site: site) }
  let(:field) do
    create(
      :field,
      item_type: another_item_type,
      api_key: "many",
      field_type: "links",
      localized: false,
      validators: {
        items_item_type: {
          item_types: [item_type.id.to_s]
        }
      },
      appeareance: {
        type: "select"
      }
    )
  end

  let(:notifier) { instance_double("NotifySiteChange", call: true) }

  before do
    another_item_type
    create(:item, item_type: item_type)
    field
    allow(NotifySiteChange).to receive(:new).with(site) { notifier }
  end

  describe "#call" do
    context do
      before { command.call }

      it "destroys the item type" do
        expect(item_type).not_to exist_in_database
      end

      it "removes it from field validators" do
        field.reload
        expect(field.validators["items_item_type"]["item_types"]).to be_empty
      end

      it "notifies about site change" do
        expect(notifier).to have_received(:call)
      end
    end

    context "with a linked menu item" do
      let(:menu_item) do
        create(:menu_item, site: site, item_type: item_type)
      end

      context "with no children" do
        before { menu_item }
        before { command.call }

        it "destroys the menu item" do
          expect(menu_item).not_to exist_in_database
        end
      end

      context "with children" do
        let(:sub_menu_item) do
          create(:menu_item, site: site, parent: menu_item)
        end

        before { sub_menu_item }
        before { command.call }

        it "removes the link to the item type" do
          expect(menu_item.reload.item_type).to be_nil
        end
      end
    end
  end
end
