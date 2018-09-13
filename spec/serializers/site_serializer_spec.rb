require "rails_helper"

RSpec.describe SiteSerializer do
  subject(:result) do
    ActiveModel::Serializer.config.adapter.new(serializer).serializable_hash
  end

  let(:serializer) do
    described_class.new(site, scope: Authentication.new(site, role))
  end

  let(:site) { create(:site) }

  let(:role) { Role::Value.new(Authenticator::NON_LOGGED_ROLE) }

  context "with no user" do
    it "it exposes name and theme" do
      expect(result[:data][:attributes].keys).to eq SiteSerializer::BASE_ATTRIBUTES
    end
  end

  context "with non-admin user" do
    let(:role) { Role::Value.new(Authenticator::READONLY_TOKEN_ROLE) }

    it "it exposes name and theme" do
      expect(result[:data][:attributes].keys).to eq SiteSerializer::BASE_ATTRIBUTES + SiteSerializer::EDITOR_ATTRIBUTES
    end
  end

  context "with admin user" do
    let(:role) { Role::Value.new(Authenticator::ADMIN_ROLE) }

    it "it exposes name and theme" do
      expect(result[:data][:attributes].keys).to eq SiteSerializer::BASE_ATTRIBUTES + SiteSerializer::EDITOR_ATTRIBUTES + SiteSerializer::ADMIN_ATTRIBUTES
    end
  end
end
