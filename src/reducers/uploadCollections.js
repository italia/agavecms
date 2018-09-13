import { createReducer } from 'redux-act'
import u from 'updeep'

import { fetch, invalidate } from 'actions/uploadCollections'

export function generateKey(query) {
  const queryWithoutPageOffset = Object.assign({}, query)
  if (!queryWithoutPageOffset['page[limit]']) {
    queryWithoutPageOffset['page[limit]'] = 30
  }
  delete queryWithoutPageOffset['page[offset]']
  return JSON.stringify(queryWithoutPageOffset)
}

const collectionInitialState = {
  isStale: null,
  isFetching: false,
  ids: [],
  totalEntries: null,
}

const collectionReducer = createReducer({
  [fetch.request]: (state) => {
    return u({ isFetching: true }, state)
  },
  [fetch.receive]: (state, { query, response }) => {
    const { data } = response
    const offset = query['page[offset]'] || 0

    if (state.isStale) {
      const index = data.findIndex(upload => state.ids[0] === upload.id)
      return u(
        {
          isFetching: false,
          isStale: false,
          ids: (ids) => [].concat(data.slice(0, index).map(r => r.id), ids),
          totalEntries: response.meta.total_count,
        },
        state
      )
    }

    if (offset < state.ids.length) {
      return u(
        {
          isFetching: false,
        },
        state
      )
    }

    return u(
      {
        isFetching: false,
        isStale: false,
        ids: (ids) => [].concat(ids, data.map(r => r.id)),
        totalEntries: response.meta.total_count,
        uploadedBytes: response.meta.uploaded_bytes,
      },
      state
    )
  },
  [invalidate]: (state) => {
    return u({ isStale: true }, state)
  },
  [fetch.fail]: (state) => {
    return u({ isFetching: false }, state)
  },
}, collectionInitialState)

export default function uploadCollections(state = {}, action) {
  switch (action.type) {
    case fetch.request.toString():
    case fetch.receive.toString():
    case fetch.fail.toString(): {
      const key = generateKey(action.payload.query)
      return u({ [key]: collectionReducer(state[key], action) }, state)
    }
    case invalidate.toString(): {
      return Object.keys(state).reduce((acc, key) => (
        u({ [key]: collectionReducer(state[key], action) }, acc)
      ), state)
    }
    default:
      return state
  }
}
