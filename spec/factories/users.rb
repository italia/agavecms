FactoryBot.define do
  factory :user do
    site
    first_name "Mario"
    last_name "Rossi"
    sequence(:email) { |i| "email-#{i}@foobar.com" }
    password "easyone"
    role

    trait :invited do
      invite_token "XXYY"
      password nil
    end

    trait :admin do
      association :role, :admin
    end
  end
end
