Cypress.Commands.add('setSession', token => {
  window.localStorage.setItem(
    'persistedState',
    `{"session" :{"bearerToken": "${token}"}}`
  )
})

Cypress.Commands.add('clearSession', () => {
  window.localStorage.removeItem('persistedState')
})

Cypress.Commands.add('logOut', () => {
  cy.clearSession()
})

Cypress.Commands.add('logIn', () => {
  cy.logOut()

  cy.apiGet('/test/session').then(response => {
    const token = response.body.data.token
    cy.setSession(token)
    cy.visit(`/enter?access_token=${token}`)
  })
})
