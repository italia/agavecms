import createAsyncAction from 'utils/createAsyncAction'
import {
  getItemType,
  updateItemType,
  createItemType,
  getItemTypes,
  destroyItemType,
  duplicateItemType,
} from 'api/agave'

export const fetchAll = createAsyncAction(
  'itemType/fetchAll',
  () => getItemTypes()
)

export const fetch = createAsyncAction(
  'itemType/fetch',
  ({ id }) => getItemType(id)
)

export const update = createAsyncAction(
  'itemType/update',
  ({ id, data }) => updateItemType(id, data)
)

export const create = createAsyncAction(
  'itemType/create',
  ({ data }) => createItemType(data)
)

export const destroy = createAsyncAction(
  'itemType/destroy',
  ({ id }) => destroyItemType(id)
)

export const duplicate = createAsyncAction(
  'itemType/duplicate',
  ({ id }) => duplicateItemType(id)
)
