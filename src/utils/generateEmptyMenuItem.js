export default function generateEmptyMenuItem(parentId, itemTypeId) {
  return {
    type: 'menu_item',
    attributes: {
      label: '',
      position: 0,
    },
    relationships: {
      item_type: {
        data: (itemTypeId ? { type: 'item_type', id: itemTypeId } : null),
      },
      parent: {
        data: (parentId ? { type: 'menu_item', id: parentId } : null),
      },
    },
  }
}
