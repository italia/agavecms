FactoryBot.define do
  factory :upload do
    site
    sequence(:path) { |i| "/foo/path-#{i}.png" }
    format "jpg"
    size 666
    width 600
    height 500
    alt "foo"
    title "bar"
  end
end
