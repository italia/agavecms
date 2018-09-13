import { createReducer } from 'redux-act'
import u from 'updeep'

import { create, destroy, force } from 'actions/session'

const initialState = {
  bearerToken: null,
}

export default createReducer({
  [create.receive]: (state, { response }) => {
    return u(
      {
        bearerToken: response.data.id,
        userType: response.data.relationships.user.data.type,
        userId: response.data.relationships.user.data.id,
      },
      state
    )
  },
  [force.receive]: (state, { response }) => {
    return u(response, state)
  },
  [destroy]: () => {
    return initialState
  },
}, initialState)
