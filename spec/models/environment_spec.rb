require 'rails_helper'

RSpec.describe Environment, type: :model do
  subject(:environment) { build(:environment) }

  it { is_expected.to validate_presence_of(:site) }
  it { is_expected.to validate_presence_of(:name) }
end
