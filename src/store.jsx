import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from 'redux'

import thunkMiddleware from 'redux-thunk'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import * as reducers from 'reducers'

import persistState, { mergePersistedState } from 'redux-localstorage'
import adapter from 'redux-localstorage/lib/adapters/localStorage'
import filter from 'redux-localstorage-filter'

import logoutOnInvalidAuthHeader from 'middlewares/logoutOnInvalidAuthHeader'

const rootReducer = combineReducers(Object.assign(
  {
    routing: routerReducer,
    form: formReducer,
  },
  reducers
))

const reducer = compose(
  mergePersistedState()
)(rootReducer)

const storage = compose(
  filter('session')
)(adapter(window.localStorage))

const customCreateStore = compose(
  applyMiddleware(thunkMiddleware),
  applyMiddleware(logoutOnInvalidAuthHeader),
  persistState(storage, 'persistedState'),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

export default customCreateStore(reducer)
