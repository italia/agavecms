require "rails_helper"

RSpec.describe SiteApiMailer, type: :mailer do
  let(:site) do
    create(
      :site,
      domain: domain
    )
  end
  let(:domain) { nil }

  describe "invitation" do
    let(:mail) { described_class.invitation(site, user) }
    let(:user) { create(:user, :invited, site: site, invite_token: "XXX") }

    it "renders the headers" do
      expect(mail.to).to eq([user.email])
    end

    context "with domain" do
      let(:domain) { "foo.bar" }
      it "renders the invitation link pointing it" do
        url = "https://foo.bar/complete_registration?token=XXX"
        expect(mail.body.encoded).to include url
      end
    end
  end

  describe "reset_password" do
    let(:mail) { described_class.reset_password(site, user) }
    let(:user) { create(:user, :invited, site: site, password_reset_token: "XXX") }

    it "renders the headers" do
      expect(mail.to).to eq([user.email])
    end

    context "with domain" do
      let(:domain) { "foo.bar" }
      it "renders the invitation link pointing it" do
        url = "https://foo.bar/reset_password?token=XXX"
        expect(mail.body.encoded).to include url
      end
    end
  end
end
