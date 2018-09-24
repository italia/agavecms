import createAsyncAction from 'utils/createAsyncAction'
import {
  getEnvironments,
  getEnvironment,
  updateEnvironment,
  createEnvironment,
  destroyEnvironment,
} from 'api/agave'

export const fetchAll = createAsyncAction(
  'environment/fetchAll',
  () => getEnvironments()
)

export const fetch = createAsyncAction(
  'environment/fetch',
  ({ id }) => getEnvironment(id)
)

export const update = createAsyncAction(
  'environment/update',
  ({ id, data }) => updateEnvironment(id, data)
)

export const create = createAsyncAction(
  'environment/create',
  ({ data }) => createEnvironment(data)
)

export const destroy = createAsyncAction(
  'environment/destroy',
  ({ id }) => destroyEnvironment(id)
)
