describe('Items', () => {
  let itemTypeId = ''

  beforeEach(() => {
    cy.createItemType().then(id => {
      itemTypeId = id
      cy.createField(
        itemTypeId,
        {
          field_type: 'text',
          appeareance: {
            type: 'markdown'
          }
        }
      )
    })
  })

  describe('When the user is logged in', () => {
    beforeEach(() => {
      cy.logIn()
    })

    context('When they create a new item', () => {
      it('saves the item', () => {
        cy.visit(`/editor/item_types/${itemTypeId}/items/new`)
        cy
          .get('.icon--add')
          .click()
        cy
          .get('.CodeMirror textarea')
          .type('Test', { force: true })
        cy
          .contains('Salva Item')
          .click()
        cy.visit(`/editor/item_types/${itemTypeId}/items/new`)

        cy.contains('Test').should('be.visible')
      })
    })
  })
})
