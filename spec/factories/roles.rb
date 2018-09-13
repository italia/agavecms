FactoryBot.define do
  factory :role do
    site
    sequence(:name) { |i| "Role #{i}" }

    trait :admin do
      can_edit_site true
      can_edit_favicon true
      can_edit_schema true
      can_manage_users true
      can_manage_access_tokens true
      can_perform_site_search true
      can_publish_to_production true
      can_dump_data true
      can_import_and_export true

      after(:create) do |role, _evaluator|
        create_list(:role_item_type_permission, 1, role: role, action: "all")
      end
    end
  end
end
