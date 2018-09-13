require "rails_helper"

RSpec.describe DestroyField do
  subject(:command) { described_class.new(field) }
  let(:item_type) { create(:item_type) }
  let(:field) { create(:field, item_type: item_type) }
  let(:another_field) { create(:field, item_type: item_type) }
  let(:item) { create(:item, data: payload, item_type: item_type) }
  let(:payload) do
    {
      field.id.to_s => "a value",
      another_field.id.to_s => "another value"
    }
  end

  describe "#call" do
    before { item }

    it "remove the field from associated items" do
      command.call
      item.reload
      expect(item.data).to eq(another_field.id.to_s => "another value")
    end
  end
end
