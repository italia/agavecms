require "rails_helper"

RSpec.describe UserSessionSerializer do
  subject(:result) do
    ActiveModel::Serializer.config.adapter.new(serializer).serializable_hash
  end
  let(:serializer) { described_class.new(session) }
  let(:session) { UserSession.new(user, site) }
  let(:user) { create(:user, site: site) }
  let(:site) { create(:site) }

  it "includes the user as link" do
    expect(result[:data][:relationships][:user][:data]).to include(:type, :id)
  end
end
