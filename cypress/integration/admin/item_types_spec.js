describe('Item Types', () => {
  it('require login', () => {
    cy.visit('/admin/item_types')
    cy.location('pathname').should('eq', '/sign_in')
  })

  describe('When the user is logged in', () => {
    beforeEach(() => {
      cy.logIn()
    })

    context('With an existing item type', () => {
      let new_item_type_id = ''

      beforeEach(() => {
        cy.request({
          method: 'POST',
          url: 'http://agave.lvh.me:3000/api/item-types',
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            Authorization: 'Bearer rwtoken'
          },
          body: {
            data: {
              type: 'item_type',
              attributes: {
                name: 'Blog post',
                api_key: 'post',
                singleton: false,
                sortable: false,
                tree: true,
                ordering_direction: null
              },
              relationships: {
                ordering_field: {
                  data: null
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
              Accept: 'application/json',
              'Content-type': 'application/json',
              Authorization: 'Bearer rwtoken'
            },
            body: {
              data: {
                type: 'field',
                attributes: {
                  label: 'Price',
                  api_key: 'price',
                  hint: '',
                  field_type: 'float',
                  validators: {},
                  localized: false,
                  position: 1,
                  appeareance: {}
                }
              }
            }
          })
        })
      })

      it('shows fields', () => {
        cy.visit(`/admin/item_types/`)
        cy.get('.ItemTypeRow').click()

        cy.contains('Price').should('be.visible')
      })
    })
  })
})
