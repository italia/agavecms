import u from 'updeep'

const mergeIntoState = function mergeIntoState(type, resources, state) {
  return resources
    .filter(resource => resource.type === type)
    .reduce((acc, resource) => {
      return u({ [resource.id]: () => resource }, acc)
    }, state)
}

function mergeEntities(type, state, { payload }) {
  if (!payload || !payload.response) {
    return state
  }

  const { response } = payload
  let newState = {}

  if (response.included) {
    newState = mergeIntoState(type, response.included, newState)
  }

  if (Array.isArray(response.data)) {
    newState = mergeIntoState(type, response.data, newState)
  }

  if (response.data) {
    newState = mergeIntoState(type, [response.data], newState)
  }

  if (payload.force && payload.query && payload.query.include) {
    const included = payload.query.include
      .split(',')
      .map(relationship => relationship.replace(/(^[^\.]+\.|s$)/g, ''))

    if (included.includes(type)) {
      return newState
    }
  }

  return Object.assign({}, state, newState)
}

function manageDestroyAction(actionCreator, state, action) {
  if (actionCreator.toString() === action.type) {
    return u(u.omit(action.payload.id), state)
  }

  return state
}

export default function(type, destroyActionCreator = null) {
  const initialState = {}
  return function reducer(state = initialState, action) {
    let newState = mergeEntities(type, state, action)
    if (destroyActionCreator) {
      newState = manageDestroyAction(destroyActionCreator, newState, action)
    }
    return newState
  }
}
