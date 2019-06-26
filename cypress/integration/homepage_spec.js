describe('The Home Page', () => {
  it('requires login', () => {
    cy.visit('/')
    cy.location('pathname').should('eq', '/sign_in')
  })
})
