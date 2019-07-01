describe('Items', () => {
  let item_type_id = ''

  beforeEach(() => {
    cy.create_item_type().then(id => {
      item_type_id = id
      cy.create_field(
        item_type_id,
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
        cy.visit(`/editor/item_types/${item_type_id}/items/new`)
        cy.get('.icon--add').click()
        cy.get('.CodeMirror textarea')
          .type('Test', { force: true })
        cy.contains('Salva Item').click()
        cy.visit(`/editor/item_types/${item_type_id}/items/new`)

        cy.contains('Test').should('be.visible')
      })
    })
  })
})
