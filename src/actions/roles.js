import createAsyncAction from 'utils/createAsyncAction'
import {
  getRole,
  updateRole,
  createRole,
  getRoles,
  destroyRole,
} from 'api/agave'

export const fetchAll = createAsyncAction(
  'role/fetchAll',
  () => getRoles()
)

export const fetch = createAsyncAction(
  'role/fetch',
  ({ id }) => getRole(id)
)

export const update = createAsyncAction(
  'role/update',
  ({ id, data }) => updateRole(id, data)
)

export const create = createAsyncAction(
  'role/create',
  ({ data }) => createRole(data)
)

export const destroy = createAsyncAction(
  'role/destroy',
  ({ id }) => destroyRole(id)
)
