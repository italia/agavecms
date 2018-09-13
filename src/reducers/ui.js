import { createReducer } from 'redux-act'
import u from 'updeep'
import getPreferredLanguage from 'utils/getPreferredLanguage'

import {
  switchLocale,
  setPreviewThemeColor,
  setItemCollectionSearchTerm,
  uploadStart,
  uploadEnd,
} from 'actions/ui'

import {
  fetch as fetchSite,
  update as updateSite,
} from 'actions/site'

const initialState = {
  locale: getPreferredLanguage(),
  itemCollectionSearchTerm: {},
  colors: null,
  previewColors: null,
  fileUploadsInProgress: 0,
}

export default createReducer({
  [switchLocale]: (state, { locale }) => u({ locale }, state),
  [setItemCollectionSearchTerm]: (state, { itemTypeId, term }) => (
    u({ itemCollectionSearchTerm: { [itemTypeId]: term } }, state)
  ),
  [fetchSite.receive]: (state, { response }) => (
    u(
      {
        colors: {
          primaryColor: response.data.attributes.theme.primary_color,
          accentColor: response.data.attributes.theme.accent_color,
          lightColor: response.data.attributes.theme.light_color,
          darkColor: response.data.attributes.theme.dark_color,
        },
      },
      state
    )
  ),
  [updateSite.receive]: (state, { response }) => (
    u(
      {
        colors: {
          primaryColor: response.data.attributes.theme.primary_color,
          accentColor: response.data.attributes.theme.accent_color,
          lightColor: response.data.attributes.theme.light_color,
          darkColor: response.data.attributes.theme.dark_color,
        },
      },
      state
    )
  ),
  [setPreviewThemeColor]: (state, { name, value }) => (
    u(
      {
        colors: {
          [name]: value,
        },
      },
      state
    )
  ),
  [uploadStart]: (state) => (
    u({ fileUploadsInProgress: state.fileUploadsInProgress + 1 }, state)
  ),
  [uploadEnd]: (state) => (
    u({ fileUploadsInProgress: state.fileUploadsInProgress - 1 }, state)
  ),
}, initialState)
