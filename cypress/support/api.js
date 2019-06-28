Cypress.Commands.add('post', (path, data) => {
  return cy.request({
    method: 'POST',
    url: `http://agave.lvh.me:3000/api${path}`,
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer rwtoken'
    },
    body: {data}
  })
})

Cypress.Commands.add('reset_database', () => {
  return cy.post('/test/reset', {})
})

Cypress.Commands.add('create_field', (item_type_id, overrides = {}) => {
  const defaults = {
    label: 'My Field',
    api_key: 'my_field',
    hint: '',
    field_type: 'float',
    validators: {},
    localized: false,
    position: 1,
    appeareance: {}
  }

  const attributes = Object.assign({}, defaults, overrides)

  cy.post(
    `/item-types/${item_type_id}/fields`,
    {type: 'field', attributes}
  )
})

Cypress.Commands.add('create_item_type', (overrides = {}) => {
  const defaults = {
    name: 'My Item Type',
    api_key: 'my_item_type',
    singleton: false,
    sortable: false,
    tree: true,
    ordering_direction: null
  }

  const attributes = Object.assign({}, defaults, overrides)

  return cy.post(
    '/item-types',
    {
      type: 'item_type',
      attributes,
      relationships: {ordering_field: {data: null}}
    }
  ).then(response => response.body.data.id)
})
