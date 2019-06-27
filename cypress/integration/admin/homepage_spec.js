describe('The Home Page', () => {
  it('requires login', () => {
    cy.visit('/')
    cy.location('pathname').should('eq', '/sign_in')
  })

  context('When user is logged', () =>{
    beforeEach(() => {
      cy.setSession()
    })

    afterEach(() => {
      cy.clearSession()
    })

    it('redirects users to setup', () => {
      cy.visit('/')
      cy.location('pathname').should('eq', '/admin/item_types')
    })
  })
})
