import createEntityReducer from 'utils/createEntityReducer'

import { destroy as destroyItemType } from 'actions/itemTypes'
import { destroy as destroyField } from 'actions/fields'
import { destroy as destroyUpload } from 'actions/uploads'
import { destroy as destroyMenuItem } from 'actions/menuItems'
import { destroy as destroyUser } from 'actions/users'
import { destroy as destroyRole } from 'actions/roles'
import { destroy as destroyItem } from 'actions/items'
import { destroy as destroyAccessToken } from 'actions/accessTokens'

export { default as ui } from 'reducers/ui'
export { default as session } from 'reducers/session'
export { default as site } from 'reducers/site'
export { default as itemCollections } from 'reducers/itemCollections'
export { default as uploadCollections } from 'reducers/uploadCollections'
export { default as notifications } from 'reducers/notifications'

export const accounts = createEntityReducer('account')
export const itemTypes = createEntityReducer('item_type', destroyItemType.receive)
export const fields = createEntityReducer('field', destroyField.receive)
export const menuItems = createEntityReducer('menu_item', destroyMenuItem.receive)
export const users = createEntityReducer('user', destroyUser.receive)
export const roles = createEntityReducer('role', destroyRole.receive)
export const items = createEntityReducer('item', destroyItem.receive)
export const uploads = createEntityReducer('upload', destroyUpload.receive)
export const deployEvents = createEntityReducer('deploy_event')
export const accessTokens = createEntityReducer('access_token', destroyAccessToken.receive)
