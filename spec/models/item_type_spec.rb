require "rails_helper"

RSpec.describe ItemType, type: :model do
  subject(:item_type) { build(:item_type) }

  it { is_expected.to validate_presence_of(:site) }
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:api_key) }
  it { is_expected.to validate_uniqueness_of(:name).scoped_to(:site_id) }
  it { is_expected.to validate_uniqueness_of(:api_key).scoped_to(:site_id) }

  it { is_expected.not_to allow_value("id").for(:api_key) }
  it { is_expected.not_to allow_value("posts").for(:api_key) }
end
