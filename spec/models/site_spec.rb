require "rails_helper"

RSpec.describe Site, type: :model do
  subject(:site) { build(:site) }

  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:timezone) }
  it { is_expected.not_to allow_value("not-a-domain.qux").for(:domain) }
  it { is_expected.to allow_value("not-a-domain.ltd").for(:domain) }
  it { is_expected.to validate_uniqueness_of(:domain).allow_blank }
  it { is_expected.not_to allow_value([]).for(:locales) }
  it { is_expected.not_to allow_value(["abc"]).for(:locales) }
end
