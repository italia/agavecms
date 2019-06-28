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
        cy.create_item_type().then(id => {
          cy.create_field(id, {label: 'Price'})
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
