FactoryBot.define do
  factory :item do
    item_type
    data { {} }
    is_valid true
  end
end
