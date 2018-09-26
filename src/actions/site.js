import createAsyncAction from 'utils/createAsyncAction'
import {
  getSite,
  deploySite,
  abortDeploySite,
  updateSite,
} from 'api/agave'

export const fetch = createAsyncAction(
  'site/fetch',
  ({ query = {} }) => getSite(query),
  (options, getState) => {
    const { site } = getState()

    if (site) {
      return Promise.resolve({ data: site })
    }

    return undefined
  }
)

export const update = createAsyncAction(
  'site/update',
  ({ data }) => updateSite(data)
)

export const deploy = createAsyncAction(
  'site/deploy',
  ({ data }) => deploySite(data)
)

export const abortDeploy = createAsyncAction(
  'site/deploy',
  ({ environment }) => abortDeploySite(environment)
)
