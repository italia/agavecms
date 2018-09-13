import createAsyncAction from 'utils/createAsyncAction'
import { getUploads } from 'api/agave'
import { generateKey as generateUploadsCollectionKey } from 'reducers/uploadCollections'
import { createAction } from 'redux-act'

export const invalidate = createAction('uploadCollections/invalidate')

export const fetch = createAsyncAction(
  'uploadCollections/fetch',
  ({ query }) => getUploads(query)
)

export const fetchAll = ({ query }) => (dispatch, getState) => {
  const key = generateUploadsCollectionKey(query)
  const data = getState().uploadCollections[key]
  if (data && !data.isStale && data.totalEntries <= data.ids.length) {
    return Promise.resolve()
  }

  if (data && data.isFetching) {
    return Promise.resolve()
  }

  let queryWithPageOffset

  if (data && data.isStale) {
    queryWithPageOffset = Object.assign(
      {}, query, { 'page[offset]': 0 }
    )
  } else {
    queryWithPageOffset = Object.assign(
      {}, query,
      { 'page[offset]': data ? data.ids.length : 0 }
    )
  }

  return dispatch(fetch({ query: queryWithPageOffset }))
}
