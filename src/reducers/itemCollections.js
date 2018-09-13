import { createReducer } from 'redux-act'
import u from 'updeep'

import { fetch, invalidate } from 'actions/itemCollections'
import {
  update as updateItem,
  create as createItem,
  destroy as destroyItem,
  duplicate as duplicateItem,
} from 'actions/items'
import {
  update as updateField,
  create as createField,
  destroy as destroyField,
} from 'actions/fields'
import {
  create as createItemType,
  update as updateItemType,
  destroy as destroyItemType,
} from 'actions/itemTypes'
import {
  update as updateSite,
} from 'actions/site'

export function generateKey(query) {
  const queryWithoutPageOffset = Object.assign({}, query)
  if (!queryWithoutPageOffset['page[limit]']) {
    queryWithoutPageOffset['page[limit]'] = 30
  }
  delete queryWithoutPageOffset['page[offset]']
  return JSON.stringify(queryWithoutPageOffset)
}

const collectionInitialState = {
  isPristine: true,
  isFetching: false,
  ids: [],
  totalEntries: null,
}

const collectionReducer = createReducer({
  [fetch.request]: (state) => {
    return u({ isPristine: false, isFetching: true }, state)
  },
  [fetch.receive]: (state, { query, response }) => {
    const { data } = response
    const offset = query['page[offset]'] || 0

    if (offset < state.ids.length) {
      return u(
        {
          isFetching: false,
          isPristine: false,
        },
        state
      )
    }

    return u(
      {
        isFetching: false,
        isPristine: false,
        ids: (ids) => [].concat(ids, data.map(r => r.id)),
        totalEntries: response.meta.total_count,
      },
      state
    )
  },
  [fetch.fail]: (state) => {
    return u({ isFetching: false }, state)
  },
}, collectionInitialState)

function resetCollections(state, itemTypeId) {
  let newState = state
  Object.keys(state).forEach(key => {
    const query = JSON.parse(key)
    const filterType = query['filter[type]']
    if (!filterType || filterType === itemTypeId) {
      newState = u({ [key]: collectionInitialState }, newState)
    }
  })
  return newState
}

export default function itemCollections(state = {}, action) {
  switch (action.type) {
    case fetch.request.toString():
    case fetch.receive.toString():
    case fetch.fail.toString(): {
      const key = generateKey(action.payload.query)
      return u({ [key]: collectionReducer(state[key], action) }, state)
    }
    case destroyField.receive.toString():
    case createField.receive.toString():
    case updateField.receive.toString():
    case createItem.receive.toString():
    case duplicateItem.receive.toString():
    case destroyItem.receive.toString():
    case updateItem.receive.toString(): {
      const itemTypeId = action.payload.response.data.relationships.item_type.data.id
      return resetCollections(state, itemTypeId)
    }
    case createItemType.receive.toString():
    case destroyItemType.receive.toString():
    case updateItemType.receive.toString():
    case updateSite.receive.toString(): {
      return {}
    }
    case invalidate.toString(): {
      const itemTypeId = action.payload.itemTypeId
      return resetCollections(state, itemTypeId)
    }
    default:
      return state
  }
}
