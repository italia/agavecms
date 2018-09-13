import createAsyncAction from 'utils/createAsyncAction'
import {
  getUser,
  updateUser,
  createUser,
  getUsers,
  destroyUser,
  createPasswordReset,
} from 'api/agave'

export const fetchAll = createAsyncAction(
  'user/fetchAll',
  () => getUsers()
)

export const fetch = createAsyncAction(
  'user/fetch',
  ({ id }) => getUser(id)
)

export const update = createAsyncAction(
  'user/update',
  ({ id, data }) => updateUser(id, data)
)

export const create = createAsyncAction(
  'user/create',
  ({ data }) => createUser(data)
)

export const destroy = createAsyncAction(
  'user/destroy',
  ({ id }) => destroyUser(id)
)

export const resetPassword = createAsyncAction(
  'user/resetPassword',
  ({ data }) => createPasswordReset(data)
)
