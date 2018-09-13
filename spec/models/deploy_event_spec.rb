require "rails_helper"

RSpec.describe DeployEvent, type: :model do
  subject(:deploy_event) { build(:deploy_event) }

  it { is_expected.to validate_presence_of(:event_type) }
  it { is_expected.to validate_presence_of(:site) }
  it { is_expected.not_to allow_value("foo").for(:event_type) }
end
