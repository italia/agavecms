export default function generateEmptyItemType() {
  return {
    type: 'item_type',
    attributes: {
      name: '',
      api_key: '',
      sortable: false,
      tree: false,
      singleton: false,
      ordering_direction: null,
    },
    relationships: {
      ordering_field: {
        data: null,
      },
    },
  }
}
