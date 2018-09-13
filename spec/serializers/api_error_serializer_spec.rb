require "rails_helper"

RSpec.describe ApiErrorSerializer do
  subject(:result) do
    ActiveModel::Serializer.config.adapter.new(serializer).serializable_hash
  end
  let(:serializer) { described_class.new(object) }
  let(:object) { ApiError.new("FOO") }

  it "the ID is the error code" do
    expect(result[:data][:id]).to eq "FOO"
  end
end
