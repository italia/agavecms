Cypress.Commands.add('setSession', () => {
  window.localStorage.setItem(
    'persistedState',
    '{"session" :{"bearerToken": "rwtoken"}}'
  )
})

Cypress.Commands.add('clearSession', () => {
  window.localStorage.removeItem('persistedState')
})
