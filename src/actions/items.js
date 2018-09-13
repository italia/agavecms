import createAsyncAction from 'utils/createAsyncAction'
import {
  getItem,
  updateItem,
  createItem,
  destroyItem,
  duplicateItem,
} from 'api/agave'

export const fetch = createAsyncAction(
  'item/fetch',
  ({ id }) => getItem(id)
)

export const update = createAsyncAction(
  'item/update',
  ({ id, data }) => updateItem(id, data)
)

export const create = createAsyncAction(
  'item/create',
  ({ data }) => createItem(data)
)

export const destroy = createAsyncAction(
  'item/destroy',
  ({ id }) => destroyItem(id)
)

export const duplicate = createAsyncAction(
  'item/duplicate',
  ({ id }) => duplicateItem(id)
)
