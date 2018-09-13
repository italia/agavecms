import createAsyncAction from 'utils/createAsyncAction'
import {
  getDeployEvents,
  getDeployEvent,
} from 'api/agave'

export const fetchAll = createAsyncAction(
  'deployEvent/fetchAll',
  () => getDeployEvents()
)

export const fetch = createAsyncAction(
  'deployEvent/fetch',
  ({ id }) => getDeployEvent(id)
)
