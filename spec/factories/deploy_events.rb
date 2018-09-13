FactoryBot.define do
  factory :deploy_event do
    site
    event_type DeployEvent::REQUEST
    environment "production"
    data(foo: "bar")
  end
end
