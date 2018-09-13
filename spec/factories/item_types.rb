FactoryBot.define do
  factory :item_type do
    sequence(:name) { |i| "item type #{i}" }
    sequence(:api_key) { |i| "type_#{i}" }
    site
  end
end
