require "seeds"

namespace :cy do
  desc "Sets up database before each Cypress test"
  task seed: :environment do
    DatabaseCleaner.strategy = :truncation
    DatabaseCleaner.clean
    Seeds.new.setup
  end
end
