FactoryBot.define do
  factory :access_token do
    sequence(:name) { |i| "Token #{i}" }
    site
    role nil
    hardcoded_type "admin"
    sequence(:token) { |i| "TOKEN-#{i}" }

    trait :custom do
      hardcoded_type nil
      association :role, :admin
    end
  end
end
