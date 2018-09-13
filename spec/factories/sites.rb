FactoryBot.define do
  factory :site do
    sequence(:name) { |i| "My Site #{i}" }
    locales [:it]
    sequence(:production_webhook_token) { |i| "WEBHOOK-TOKEN-#{i}" }
    timezone "Europe/Rome"
    theme(
      primary_color: { red: 10, green: 10, blue: 10, alpha: 255 },
      light_color: { red: 10, green: 10, blue: 10, alpha: 255 },
      accent_color: { red: 10, green: 10, blue: 10, alpha: 255 },
      dark_color: { red: 10, green: 10, blue: 10, alpha: 255 },
      logo: nil
    )

    after(:create) do |site, evaluator|
      create(
        :access_token,
        site: site,
        name: "Read-only API token",
        token: SecureRandom.hex(15),
        hardcoded_type: "readonly"
      )

      create(
        :access_token,
        site: site,
        name: "Full-access API token",
        token: SecureRandom.hex(15),
        hardcoded_type: "admin"
      )
    end
  end
end
