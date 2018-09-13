import createAsyncAction from 'utils/createAsyncAction'
import { getItems } from 'api/agave'
import { generateKey as generateItemsCollectionKey } from 'reducers/itemCollections'
import { createAction } from 'redux-act'

export const invalidate = createAction('itemCollections/invalidate')

export const fetch = createAsyncAction(
  'itemCollections/fetch',
  ({ query }) => getItems(query)
)

export const fetchPage = ({ query }) => (dispatch, getState) => {
  const key = generateItemsCollectionKey(query)
  const data = getState().itemCollections[key]

  if (data && data.totalEntries === data.ids.length) {
    return Promise.resolve()
  }

  if (data && data.isFetching) {
    return Promise.resolve()
  }

  const queryWithPageOffset = Object.assign(
    {}, query,
    { 'page[offset]': data ? data.ids.length : 0 }
  )

  return dispatch(fetch({ query: queryWithPageOffset }))
}

export const fetchById = ({ ids }) => (dispatch, getState) => {
  const state = getState()
  const idsToFetch = ids.filter(id => !state.items[id])

  if (idsToFetch.length === 0) {
    return Promise.resolve()
  }

  const query = { 'filter[ids]': idsToFetch.join(','), 'page[limit]': 500 }
  const key = generateItemsCollectionKey(query)
  const data = state.itemCollections[key]

  if (data) {
    return Promise.resolve()
  }

  return dispatch(fetch({ query }))
}
