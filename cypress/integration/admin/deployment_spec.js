describe('Impostazioni di deploy', () => {
  beforeEach(() => {
    cy.logIn()
  })

  context('With an existing deployment', () => {
    let frontendUrl = 'https://example.com'
    let repoUrl = 'https://my-repo.example.com/repo.git'
    let environment = null

    beforeEach(() => {
      cy.createEnvironment({
        frontend_url: frontendUrl,
        git_repo_url: repoUrl
      })
    })

    it('shows settings', () => {
      cy
        .visit('/admin/deployment')
      cy.wait(400)
      cy
        .contains('staging')
        .click()

      cy
        .get('input[name=frontend_url]')
        .should('have.value', frontendUrl)
      cy
        .get('input[name=git_repo_url]')
        .should('have.value', repoUrl)
    })
  })
})
