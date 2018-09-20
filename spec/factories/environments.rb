FactoryBot.define do
  factory :environment do
    site

    sequence(:git_repo_url) { |i| "git_repo_url_#{i}" }
    sequence(:frontend_url) { |i| "#{1}_frontend_url" }
    sequence(:name) { |i| "environment_#{i}" }
  end
end
