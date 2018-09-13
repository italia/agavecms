import { createAction } from 'redux-act'

export const show = createAction('notifications/show')
export const hide = createAction('notifications/hide')

let progressiveId = 0

export const notice = (message, options = {}) => (dispatch, getState) => {
  const id = ++progressiveId

  dispatch(show({ id, type: 'notice', message }))

  if (!options.sticky) {
    setTimeout(() => {
      const state = getState()
      if (state.notifications.find(x => x.id === id)) {
        dispatch(hide({ id }))
      }
    }, 6000)
  }
}

export const alert = (message) => (dispatch) => {
  dispatch(hide({ id: 'alert' }))
  dispatch(show({ id: 'alert', type: 'alert', message }))
}

export const dismiss = (id) => (dispatch) => {
  dispatch(hide({ id }))
}
