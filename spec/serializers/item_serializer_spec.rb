require "rails_helper"

RSpec.describe ItemSerializer do
  subject(:result) do
    ActiveModel::Serializer.config.adapter.new(serializer).serializable_hash
  end
  let(:serializer) { described_class.new(item) }
  let(:timezone) { "Europe/Rome" }
  let(:site) { create(:site, timezone: timezone) }
  let(:item) do
    create(
      :item,
      item_type: item_type,
      data: {
        title.id.to_s => "Foobar",
        pub_date.id.to_s => "2015-01-01T12:30+00:00"
      },
      is_valid: true
    )
  end

  let(:item_type) { create(:item_type, site: site) }

  let(:title) do
    create(
      :field,
      item_type: item_type,
      api_key: "title",
      validators: {}
    )
  end

  let(:pub_date) do
    create(
      :field,
      item_type: item_type,
      api_key: "pub_date",
      validators: {},
      field_type: Agave::FieldType::DateTime.code
    )
  end

  before do
    title
    pub_date
  end

  it "it exports data with api_key" do
    expect(result[:data][:attributes][:title]).to eq "Foobar"
  end

  it "it exports updated_at" do
    expect(result[:data][:attributes][:updated_at]).to be_present
  end

  it "it exports is_valid" do
    expect(result[:data][:attributes][:is_valid]).to be_truthy
  end

  it "adjust time with site timezone" do
    expect(result[:data][:attributes][:pub_date]).to eq "2015-01-01T12:30:00+01:00"
  end
end
