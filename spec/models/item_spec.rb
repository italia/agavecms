require "rails_helper"

RSpec.describe Item, type: :model do
  subject(:item) { build(:item) }

  it { is_expected.to validate_presence_of(:item_type) }
end
