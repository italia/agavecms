import createAsyncAction from 'utils/createAsyncAction'
import { createAction } from 'redux-act'
import { createSession, testBearerToken } from 'api/agave'

export const destroy = createAction('session/destroy')

export const create = createAsyncAction(
  'session/create',
  ({ data }) => createSession(data)
)

export const force = createAsyncAction(
  'session/force',
  ({ bearerToken }) => {
    return testBearerToken(bearerToken)
    .then(({ data }) => {
      return {
        bearerToken,
        userType: data.type,
        userId: data.id,
      }
    })
  }
)
