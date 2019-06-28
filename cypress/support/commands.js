Cypress.Commands.add('setSession', () => {
  window.localStorage.setItem(
    'persistedState',
    '{"session" :{"bearerToken": "rwtoken"}}'
  )
})

Cypress.Commands.add('clearSession', () => {
  window.localStorage.removeItem('persistedState')
})

Cypress.Commands.add('logOut', () => {
  cy.clearCookies()
  cy.clearSession()
})

Cypress.Commands.add('logIn', () => {
  cy.logOut()

  const email = 'admin@agave.example.it'
  const password = 'secret'

  cy.visit('/sign_in')
  cy.get('input[name=email]').type(email)
  cy.get('input[name=password]').type(password)
  cy.get('form').submit()
})

Cypress.Commands.add('post', (path, data) => {
  return cy.request({
    method: 'POST',
    url: `http://agave.lvh.me:3000/api${path}`,
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer rwtoken'
    },
    body: {data}
  })
})
