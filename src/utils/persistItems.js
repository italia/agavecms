import { SubmissionError } from 'redux-form'

import {
  update as updateItem,
  create as createItem,
} from 'actions/items'

import convertToFormErrors from 'utils/convertToFormErrors'

function persistItem(dispatch, item) {
  if (item.id) {
    const { id, type, attributes } = item
    return dispatch(updateItem({ id, data: { id, type, attributes } }))
    .then(({ data }) => data)
  }

  return dispatch(createItem({ data: item }))
  .then(({ data }) => data)
}

function persistItemAndHandleErrors(dispatch, { key, item }) {
  return persistItem(dispatch, item)
    .then(persistedItem => ({ key, item: persistedItem, errors: null }))
    .catch((error) => Promise.resolve({ key, item, errors: convertToFormErrors(error, false) }))
}

export default function persistItems(items, dispatch) {
  const { item } = items.find(({ key }) => !key)

  return Promise.all(
    items
    .filter(({ key }) => key)
    .map(persistItemAndHandleErrors.bind(this, dispatch))
  )
  .then(results => {
    const itemErrors = {}

    results
    .filter(({ key }) => key)
    .forEach(({ key, errors }) => {
      const [attr, index] = key.split('.')
      if (errors) {
        /* eslint-disable dot-notation */
        if (errors['_error']) {
          itemErrors['_error'] = errors['_error']
        }
        /* eslint-enable dot-notation */

        itemErrors[attr] = itemErrors[attr] || []
        itemErrors[attr][index] = errors
      }
    })

    if (Object.keys(itemErrors).length > 0) {
      return Promise.reject(new SubmissionError(itemErrors))
    }

    return results
  })
  .then(deepItemsResults => {
    deepItemsResults
    .forEach(({ key, item: deepItem }) => {
      const chunks = key.split('.')
      const attr = chunks[0]
      if (chunks.length === 2) {
        const index = chunks[1]
        item.attributes[attr] = item.attributes[attr] || []
        item.attributes[attr][index] = deepItem.id
      } else {
        const locale = chunks[1]
        const index = chunks[2]
        item.attributes[attr] = item.attributes[attr] || {}
        item.attributes[attr][locale] = item.attributes[attr][locale] || []
        item.attributes[attr][locale][index] = deepItem.id
      }
    })

    return persistItem(dispatch, item)
      .catch((error) => {
        return Promise.reject(convertToFormErrors(error))
      })
  })
}
