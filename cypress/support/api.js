const headers = {
  Accept: 'application/json',
  'Content-type': 'application/json',
  Authorization: 'Bearer rwtoken'
}

Cypress.Commands.add('apiGet', path => {
  return cy.request({
    method: 'GET',
    url: `http://agave.lvh.me:3000/api${path}`,
    headers
  })
})

Cypress.Commands.add('apiPost', (path, data) => {
  return cy.request({
    method: 'POST',
    url: `http://agave.lvh.me:3000/api${path}`,
    headers,
    body: {data}
  })
})

Cypress.Commands.add('resetDatabase', () => {
  return cy.apiPost('/test/reset', {})
})

Cypress.Commands.add('createField', (item_type_id, overrides = {}) => {
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

  cy.apiPost(
    `/item-types/${item_type_id}/fields`,
    {type: 'field', attributes}
  ).then(response => response.body.data)
})

Cypress.Commands.add('createItemType', (overrides = {}) => {
  const defaults = {
    name: 'My Item Type',
    api_key: 'my_item_type',
    singleton: false,
    sortable: false,
    tree: true,
    ordering_direction: null
  }

  const attributes = Object.assign({}, defaults, overrides)

  return cy.apiPost(
    '/item-types',
    {
      type: 'item_type',
      attributes,
      relationships: {ordering_field: {data: null}}
    }
  ).then(response => response.body.data)
})
