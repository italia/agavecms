import { createReducer } from 'redux-act'
import { fetch, update } from 'actions/site'

const initialState = null

export default createReducer({
  [fetch.receive]: (state, { response }) => response.data,
  [update.receive]: (state, { response }) => response.data
}, initialState)
