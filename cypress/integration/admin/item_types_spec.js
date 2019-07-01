describe('Item Types', () => {
  it('requires login', () => {
    cy.visit('/admin/item_types')
    cy.location('pathname').should('eq', '/sign_in')
  })

  describe('When the user is logged in', () => {
    beforeEach(() => {
      cy.logIn()
    })

    context('With an existing item type', () => {
      beforeEach(() => {
        cy.createItemType().then(({id}) => {
          cy.createField(id, {label: 'Price'})
        })
      })

      it('shows fields', () => {
        cy.visit('/admin/item_types')
        cy.get('.ItemTypeRow').click()

        cy.contains('Price').should('be.visible')
      })
    })
  })
})
