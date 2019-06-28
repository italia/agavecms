describe('The Items', () => {
  let new_item_type_id = ""

  beforeEach(() => {
    cy.request({
      method: 'POST',
      url: 'http://agave.lvh.me:3000/api/item-types',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Authorization': 'Bearer rwtoken'
      },
      body: {
        "data": {
          "type": "item_type",
          "attributes": {
            "name": "Blog post",
            "api_key": "post",
            "singleton": false,
            "sortable": false,
            "tree": true,
            "ordering_direction": null
          },
          "relationships": {
            "ordering_field": {
              "data": null
            }
          }
        }
      }
    }).then((response) => {
      new_item_type_id = response.body.data.id

      cy.request({
        method: 'POST',
        url: `http://agave.lvh.me:3000/api/item-types/${new_item_type_id}/fields`,
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
          'Authorization': 'Bearer rwtoken'
        },
        body: JSON.stringify({
          data: {
            type: "field",
            attributes: {
              label: "Editor",
              api_key: "editor",
              hint: "",
              field_type: "text",
              appeareance: {
                type: "markdown"
              },
              validators: {},
              localized: false,
              position: 1,
            }
          }
        })
      })
    })
  })

  describe('When user is logged', () => {
    const email = "admin@agave.example.it"
    const password = "secret"

    beforeEach(() => {
      cy.visit('/sign_in')

      cy.get('input[name=email]').type(email)
      cy.get('input[name=password]').type(password)
      cy.get('form').submit()

    })

    afterEach(() => {
      cy.clearSession()
    })

    context('When create a new item', () => {
      it('requires login', () => {
        cy.visit(`/editor/item_types/${new_item_type_id}/items/new`)
        cy.get('.icon--add').click()
        cy.get('.CodeMirror textarea')
          .type('Test', { force: true })
        cy.get('.button--huge').click()
        cy.visit(`/editor/item_types/${new_item_type_id}/items/new`)

        cy.contains('Test').should('be.visible')
      })
    })
  })
})
