import createAsyncAction from 'utils/createAsyncAction'
import {
  updateMenuItem,
  createMenuItem,
  getMenuItems,
  destroyMenuItem,
} from 'api/agave'

export const fetchAll = createAsyncAction(
  'menuItem/fetchAll',
  () => getMenuItems()
)

export const update = createAsyncAction(
  'menuItem/update',
  ({ id, data }) => updateMenuItem(id, data)
)

export const create = createAsyncAction(
  'menuItem/create',
  ({ data }) => createMenuItem(data)
)

export const destroy = createAsyncAction(
  'menuItem/destroy',
  ({ id }) => destroyMenuItem(id)
)
