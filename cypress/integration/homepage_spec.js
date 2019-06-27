describe('The Home Page for non-autorized users', () => {
  it('requires login', () => {
    cy.visit('/')
    cy.location('pathname').should('eq', '/sign_in')
  })
})

describe('The Home Page for autorized users', () => {
  beforeEach(() => {
    window.localStorage.setItem(
      'persistedState',
      '{"session" :{"bearerToken": "rwtoken"}}'
    )
  })

  it('redirects users to setup', () => {
    cy.visit('/')
    cy.location('pathname').should('eq', '/admin/item_types')
  })
})
