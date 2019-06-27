Cypress.Commands.add('setSession', () => {
  window.localStorage.setItem(
    'persistedState',
    '{"session" :{"bearerToken": "rwtoken"}}'
  )
})
