describe('The signIn', () => {
  context('With wrong credentials', () => {
    const wrong_email = "foo@bar.com"
    const wrong_password = "foo_bar"

    beforeEach(() => {
      cy.visit('/sign_in')

      cy.get('input[name=email]').type(wrong_email)
      cy.get('input[name=password]').type(wrong_password)
      cy.get('form').submit()
    })

    it('Displays form error', () => {
      cy.get('div.form__global-error').should('be.visible')
    })

    it('Displays modal error', () => {
      cy.get('div.Notifications__item__message').should('be.visible')
    })

    it('Stays on the same URL', () => {
      cy.url().should('include', '/sign_in')
    })
  })

  context('When user is logged', () =>{
    const email = "admin@agave.example.it"
    const password = "secret"

    beforeEach(() => {
      cy.visit('/sign_in')

      cy.get('input[name=email]').type(email)
      cy.get('input[name=password]').type(password)
      cy.get('form').submit()
    })

    it('Redirects to /admin/item_types', () => {
      cy.url().should('include', '/admin/item_types')
    })
  })
})
