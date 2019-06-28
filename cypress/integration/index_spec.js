describe('The Home Page', () => {
  it('requires login', () => {
    cy.visit('/')
    cy.location('pathname').should('eq', '/sign_in')
  })

  context('When the user is logged in', () =>{
    beforeEach(() => {
      cy.clearCookies()
      cy.logIn()
    })

    it('redirects to admin', () => {
      cy.visit('/')
      cy.location('pathname').should('eq', '/admin/item_types')
    })
  })
})
