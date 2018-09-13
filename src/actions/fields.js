import createAsyncAction from 'utils/createAsyncAction'
import {
  updateField,
  createField,
  getFieldsForItemType,
  destroyField,
} from 'api/agave'

export const fetchAll = createAsyncAction(
  'field/fetchForItemType',
  ({ itemTypeId }) => getFieldsForItemType(itemTypeId)
)

export const update = createAsyncAction(
  'field/update',
  ({ id, data }) => updateField(id, data)
)

export const create = createAsyncAction(
  'field/create',
  ({ itemTypeId, data }) => createField(itemTypeId, data)
)

export const destroy = createAsyncAction(
  'field/destroy',
  ({ id }) => destroyField(id)
)
