import createAsyncAction from 'utils/createAsyncAction'
import {
  getUpload,
  getUploads,
  updateUpload,
  createUpload,
  destroyUpload,
} from 'api/agave'

export const fetchAll = createAsyncAction(
  'upload/fetchAll',
  ({ params }) => getUploads(params)
)

export const fetch = createAsyncAction(
  'upload/fetch',
  ({ id }) => getUpload(id)
)

export const update = createAsyncAction(
  'upload/update',
  ({ id, data }) => updateUpload(id, data)
)

export const create = createAsyncAction(
  'upload/create',
  ({ data }) => createUpload(data)
)

export const destroy = createAsyncAction(
  'upload/destroy',
  ({ id }) => destroyUpload(id)
)
