require "rails_helper"

RSpec.describe AccessToken, type: :model do
  subject(:access_token) { build(:access_token) }

  it { is_expected.to validate_presence_of(:site) }
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:token) }
end
