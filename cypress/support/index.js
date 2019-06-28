import './api'
import './authentication'

beforeEach(() => {
  cy.exec('RAILS_ENV=test bundle exec rails cy:seed')
})
