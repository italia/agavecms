require "rails_helper"

RSpec.describe Field, type: :model do
  subject(:field) { build(:field) }

  it { is_expected.to validate_presence_of(:item_type) }
  it { is_expected.to validate_presence_of(:label) }
  it { is_expected.to validate_presence_of(:api_key) }
  it { is_expected.to validate_presence_of(:field_type) }
  it { is_expected.to validate_inclusion_of(:field_type).in_array(Agave::FieldType.codes) }
  it { is_expected.to validate_uniqueness_of(:label).scoped_to(:item_type_id) }
  it { is_expected.to validate_uniqueness_of(:api_key).scoped_to(:item_type_id) }

  it { is_expected.not_to allow_value("id").for(:api_key) }
  it { is_expected.not_to allow_value("updated_at").for(:api_key) }
  it { is_expected.not_to allow_value("is_valid").for(:api_key) }
  it { is_expected.not_to allow_value("position").for(:api_key) }

  it { is_expected.not_to allow_value("FOO").for(:api_key) }
  it { is_expected.not_to allow_value("foo/bar").for(:api_key) }

  it { is_expected.not_to allow_value([]).for(:validators) }
  it { is_expected.not_to allow_value(size: true).for(:validators) }
  it { is_expected.to allow_value(length: { min: 3 }).for(:validators) }
  it { is_expected.to allow_value({}).for(:validators) }
  it { is_expected.to allow_value(required: {}).for(:validators) }
end
