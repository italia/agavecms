require "rails_helper"

RSpec.describe MenuItem, type: :model do
  subject(:menu_item) { build(:menu_item) }

  it { is_expected.to validate_presence_of(:label) }
  it { is_expected.to validate_presence_of(:site) }
  it { is_expected.to validate_presence_of(:position) }

  it do
    is_expected.to validate_uniqueness_of(:label).
      scoped_to(%i(site_id parent_id))
  end
end
