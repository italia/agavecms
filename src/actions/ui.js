import { createAction } from 'redux-act'

export const switchLocale = createAction('ui/switchLocale')
export const setItemCollectionSearchTerm = createAction('ui/setItemCollectionSearchTerm')
export const setPreviewThemeColor = createAction('ui/setPreviewThemeColor')
export const uploadStart = createAction('ui/uploadStart')
export const uploadEnd = createAction('ui/uploadEnd')
