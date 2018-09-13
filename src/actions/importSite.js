import createAsyncAction from 'utils/createAsyncAction'
import { createImport } from 'api/agave'

const create = createAsyncAction(
  'site/import',
  ({ data }) => {
    return createImport({ data })
  }
)

export { create }

export default null
