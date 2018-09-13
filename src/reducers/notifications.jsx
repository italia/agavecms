import { createReducer } from 'redux-act'
import { show, hide } from 'actions/notifications'
import { LOCATION_CHANGE } from 'react-router-redux'

const initialState = []

export default createReducer({
  [show]: (state, notification) => [].concat(state, notification),
  [hide]: (state, { id }) => state.filter(n => n.id !== id),
  [LOCATION_CHANGE]: (state) => state.filter(n => n.type !== 'alert'),
}, initialState)
