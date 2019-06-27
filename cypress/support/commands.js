Cypress.Commands.add('loginByForm', (email, password) => {
  cy.get('input[name=email]').type(email)
  cy.get('input[name=password]').type(password)

  return cy.get('form').submit()
})

Cypress.Commands.add('clearLoginForm', () => {
  cy.get('input[name=email]').clear()
  cy.get('input[name=email]').clear()
})
