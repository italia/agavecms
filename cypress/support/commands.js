Cypress.Commands.add('setSession', () => {
  window.localStorage.setItem(
    'persistedState',
    '{"session" :{"bearerToken": "rwtoken"}}'
  )
})

Cypress.Commands.add('clearSession', () => {
  window.localStorage.removeItem('persistedState')
})

Cypress.Commands.add('logIn', () => {
  const email = 'admin@agave.example.it'
  const password = 'secret'

  cy.visit('/sign_in')
  cy.get('input[name=email]').type(email)
  cy.get('input[name=password]').type(password)
  cy.get('form').submit()
})
