describe('The Home Page for non-autorized users', () => {
  it('requires login', () => {
    cy.visit('/')
    cy.location('pathname').should('eq', '/sign_in')
  })

  context('With wrong credentials', () => {
    beforeEach(() => {
      cy.visit('/sign_in')
      cy.loginByForm('foo@bar.com', 'foo_bar')
    })

    afterEach(() => {
      cy.clearLoginForm()
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
    const user = "admin@agave.example.it"
    const password = "secret"

    beforeEach(() => {
      cy.visit('/sign_in')
      cy.loginByForm(user, password)
    })

    it('Redirects to /admin/item_types', () => {
      cy.url().should('include', '/admin/item_types')
    })
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
