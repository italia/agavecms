import { generateKey as generateItemsCollectionKey } from 'reducers/itemCollections'

export function getFieldsForItemType(state, itemType) {
  if (!itemType) {
    return []
  }

  return itemType.relationships.fields.data
    .map(link => link.id)
    .map(id => state.fields[id])
    .filter(field => !!field)
}

export function getTitleFieldForItemType(state, itemType) {
  if (!itemType) {
    return null
  }

  const fields = getFieldsForItemType(state, itemType)

  const title = fields.find(({ attributes }) => {
    return attributes.field_type === 'string' &&
      attributes.appeareance.type === 'title'
  })

  if (title) {
    return title
  }

  const string = fields.find(({ attributes }) => {
    return attributes.field_type === 'string'
  })

  if (string) {
    return string
  }

  const text = fields.find(({ attributes }) => {
    return attributes.field_type === 'text'
  })

  if (text) {
    return text
  }

  const video = fields.find(({ attributes }) => {
    return attributes.field_type === 'video'
  })

  if (video) {
    return video
  }

  return undefined
}

export function getImageFieldsForItemType(state, itemType) {
  if (!itemType) {
    return null
  }
  return getFieldsForItemType(state, itemType)
    .filter(field => ['image', 'gallery', 'video', 'file'].includes(field.attributes.field_type))
}

export function getItemsForQuery(state, query) {
  const key = generateItemsCollectionKey(query)
  const data = state.itemCollections[key]

  if (!data) {
    return {
      items: [],
      totalEntries: 0,
      isPristine: true,
      isComplete: false,
      isFetching: false,
    }
  }

  return {
    items: data.ids.map((id) => state.items[id]),
    isPristine: data.isPristine,
    totalEntries: data.totalEntries,
    isComplete: data.totalEntries === data.ids.length,
    isFetching: data.isFetching,
  }
}

export function getUploadsForQuery(state, query) {
  const key = generateItemsCollectionKey(query)
  const data = state.uploadCollections[key]

  if (!data) {
    return {
      uploads: [],
      totalEntries: 0,
      isPristine: true,
      isComplete: false,
      isFetching: false,
    }
  }

  return {
    uploads: data.ids.map((id) => state.uploads[id]),
    isPristine: data.isPristine,
    totalEntries: data.totalEntries,
    isComplete: data.totalEntries === data.ids.length,
    isFetching: data.isFetching,
    uploadedBytes: data.uploadedBytes,
  }
}

export function getCurrentUser(state) {
  const { userId, userType } = state.session

  if (userType === 'user') {
    return state.users[userId]
  } else if (userType === 'account') {
    return state.accounts[userId]
  }

  return null
}

export function getCurrentRole(state) {
  const currentUser = getCurrentUser(state)

  if (!currentUser) {
    return null
  }

  if (currentUser.type === 'account') {
    return {
      attributes: {
        can_read_deploy_events: true,
        can_access_site: true,
        can_edit_site: true,
        can_edit_schema: true,
        can_manage_users: true,
        can_publish_to_production: true,
        can_edit_favicon: true,
        positive_item_type_permissions: [{ item_type: null, action: 'all' }],
        negative_item_type_permissions: [],
      },
    }
  }

  const roleId = currentUser.relationships.role.data.id
  return state.roles[roleId]
}

function itemTypesForRule(state, rule) {
  if (rule.item_type) {
    return [rule.item_type]
  }

  return Object.keys(state.itemTypes)
}

export function allowedItemTypesForAction(state, action) {
  const role = getCurrentRole(state)
  let allowedItemTypes = []

  if (!role) {
    return []
  }

  role.attributes.positive_item_type_permissions.forEach(rule => {
    if (rule.action === 'all' || rule.action === action) {
      allowedItemTypes = allowedItemTypes.concat(itemTypesForRule(state, rule))
    }
  })

  role.attributes.negative_item_type_permissions.forEach(rule => {
    if (rule.action === 'all' || rule.action === action) {
      const itemTypes = itemTypesForRule(state, rule)
      allowedItemTypes = allowedItemTypes.filter(id => !itemTypes.includes(id))
    }
  })

  return allowedItemTypes
}

export function canPerformActionOnItemType(state, action, itemTypeId) {
  const allowedItemTypes = allowedItemTypesForAction(state, action)
  return allowedItemTypes.includes(itemTypeId)
}
