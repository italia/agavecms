import { destroy } from 'actions/session'

export default function logoutOnInvalidAuthHeader() {
  return (next) => (action) => {
    if (
      action.payload &&
      action.payload.error &&
      action.payload.error.data &&
      Array.isArray(action.payload.error.data)
    ) {
      const errors = action.payload.error.data

      const invalidAuthHeader = errors.some((error) => {
        return error.id === 'INVALID_AUTHORIZATION_HEADER'
      })

      if (invalidAuthHeader) {
        const returnValue = next(destroy())
        document.location = '/'
        return returnValue
      }
    }

    return next(action)
  }
}
