FactoryBot.define do
  factory :deploy_event do
    site
    event_type DeployEvent::REQUEST
    environment
    data(foo: "bar")
  end
end
