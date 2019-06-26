describe('The Home Page', () => {
  beforeEach(() => {
    cy.exec('RAILS_ENV=test bundle exec rake db:drop || true')
    cy.exec('RAILS_ENV=test bundle exec rake db:create db:migrate')
    cy.exec('RAILS_ENV=test bundle exec rake db:seed')
  })

  it('requires login', () => {
    cy.visit('/')
    cy.location('pathname').should('eq', '/sign_in')
  })
})
