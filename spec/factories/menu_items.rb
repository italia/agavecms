FactoryBot.define do
  factory :menu_item do
    site
    sequence(:label) { |i| "Item ##{i}" }
    item_type nil
    position 1
  end
end
