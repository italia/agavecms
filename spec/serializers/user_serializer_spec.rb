require "rails_helper"

RSpec.describe UserSerializer do
  subject(:result) do
    ActiveModel::Serializer.config.adapter.new(serializer).serializable_hash
  end
  let(:serializer) { described_class.new(object) }
  let(:object) { create(:user) }

  it "the password digest is not exposed" do
    expect(result[:data][:attributes]).not_to include(:password_digest)
  end
end
