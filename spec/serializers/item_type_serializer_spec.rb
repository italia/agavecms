require "rails_helper"

RSpec.describe ItemTypeSerializer do
  subject(:result) do
    ActiveModel::Serializer.config.adapter.new(serializer).serializable_hash
  end

  let(:serializer) { described_class.new(object, scope: scope) }
  let(:object) { create(:item_type) }
  let(:scope) { Authentication.new(site, role) }
  let(:site) { create(:site) }
  let(:role) { Role::Value.new(Authenticator::NON_LOGGED_ROLE) }

  context "if the item type is a singleton" do
    let(:object) { create(:item_type, site: site, singleton: true) }
    let(:item) { create(:item, item_type: object) }

    before do
      object.update_attributes!(singleton_item: item)
    end

    it "hides the singleton item" do
      expect(result[:data][:relationships][:singleton_item][:data]).to be_nil
    end

    context "with proper permission" do
      let(:role) { Role::Value.new(Authenticator::ADMIN_ROLE) }

      it "adds the singleton item as a link" do
        expect(result[:data][:relationships][:singleton_item][:data][:id]).to eq item.id.to_s
      end
    end
  end
end
