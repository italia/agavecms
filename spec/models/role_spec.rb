require "rails_helper"

RSpec.describe Role, type: :model do
  subject(:role) { build(:role) }

  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:site) }
  it { is_expected.to validate_uniqueness_of(:name).scoped_to(:site_id) }

  context "if a role is linked to a user" do
    it "destroy raises an exception" do
      role = create(:role)
      create(:user, role: role)

      expect { role.destroy }.to raise_error ActiveRecord::DeleteRestrictionError
    end
  end
end
