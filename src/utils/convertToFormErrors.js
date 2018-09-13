import { SubmissionError } from 'redux-form'
import updeep from 'updeep'

export default function convertToFormErrors(response, wrapInSubissionError = true) {
  if (!response.data) {
    return {}
  }

  const { data } = response

  const result = data.reduce((errors, { id, attributes }) => {
    if (id === 'INVALID_FIELD') {
      const { field, locale, code, options } = attributes.details

      let errorField = locale ? `${field}.${locale}` : field

      if (field === 'base') {
        errorField = '_error'
      }

      let values = {}

      if (options) {
        const valorizedKeys = Object.entries(options)
          .filter((entry) => !!entry[1])
          .map((entry) => entry[0])
          .sort()
          .join('_')

        const formattedOptions = Object.entries(options).reduce((acc, [option, value]) => {
          if (Array.isArray(value)) {
            return Object.assign(acc, { [option]: value.join(', ') })
          }

          return Object.assign(acc, { [option]: value })
        }, {})

        values = Object.assign(formattedOptions, { valorizedKeys })
      }

      return updeep.updateIn(errorField, { id: code, values }, errors)
    }

    return Object.assign({ _error: id }, errors)
  }, {})

  return wrapInSubissionError ?
    new SubmissionError(result) :
    result
}
