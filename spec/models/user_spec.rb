require "rails_helper"

RSpec.describe User, type: :model do
  subject(:user) { build(:user) }

  it { is_expected.to validate_presence_of(:site) }
  it { is_expected.to validate_presence_of(:first_name) }
  it { is_expected.to validate_presence_of(:last_name) }
  it { is_expected.to validate_presence_of(:email) }
  it { is_expected.to validate_presence_of(:password_digest) }
  it { is_expected.not_to allow_value("not_an_email").for(:email) }
  it { is_expected.to validate_uniqueness_of(:email).scoped_to(:site_id) }
end
