import createAsyncAction from 'utils/createAsyncAction'
import {
  getAccessToken,
  updateAccessToken,
  createAccessToken,
  getAccessTokens,
  destroyAccessToken,
  regenerateAccessToken,
} from 'api/agave'

export const fetchAll = createAsyncAction(
  'accessToken/fetchAll',
  () => getAccessTokens()
)

export const fetch = createAsyncAction(
  'accessToken/fetch',
  ({ id }) => getAccessToken(id)
)

export const update = createAsyncAction(
  'accessToken/update',
  ({ id, data }) => updateAccessToken(id, data)
)

export const create = createAsyncAction(
  'accessToken/create',
  ({ data }) => createAccessToken(data)
)

export const destroy = createAsyncAction(
  'accessToken/destroy',
  ({ id }) => destroyAccessToken(id)
)

export const regenerateToken = createAsyncAction(
  'accessToken/regenerateToken',
  ({ id }) => regenerateAccessToken(id)
)
