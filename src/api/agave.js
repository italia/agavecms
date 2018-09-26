import {
  post as postRequest,
  get as getRequest,
  put as putRequest,
  destroy as destroyRequest,
} from 'utils/request'

import queryString from 'query-string'
import config from 'config'
import store from 'store'

function siteDomain() {
  return localStorage.getItem('domain') ||
    window.location.host.replace(/:[0-9]+$/, '')
}

function bearerToken() {
  return store.getState().session.bearerToken
}

const wrapRequest = function wrapRequest(fn, hasBodyParameter) {
  return function wrappedRequest(path, ...args) {
    const options = (hasBodyParameter ? args[1] : args[0]) || {}
    const optionsHeaders = options.headers || {}
    const headers = Object.assign({}, {
      'X-Site-Domain': siteDomain(),
      Accept: 'application/json'
    }, optionsHeaders)

    // If the body is FormData, fetch(sets the content type to
    //   'Content-Type': 'multipart/form-data; boundary=hello123'
    const hasFormData = options.body && options.body instanceof FormData
    if (hasFormData) {
      delete headers['Content-Type']
    } else {
      headers['Content-Type'] = 'application/json'
    }

    const augmentedOptions = Object.assign({}, options, { headers })

    const token = bearerToken()

    if (token) {
      augmentedOptions.headers.Authorization = `Bearer ${token}`
    }

    if (hasBodyParameter) {
      return fn(config.apiBaseUrl + path, args[0], augmentedOptions)
    }
    return fn(config.apiBaseUrl + path, augmentedOptions)
  }
}

const post = wrapRequest(postRequest, true)
const get = wrapRequest(getRequest)
const put = wrapRequest(putRequest, true)
const destroy = wrapRequest(destroyRequest)

export function createSession(data) {
  return post('/sessions', { data })
}

export function getSite(query) {
  return get(`/site?${queryString.stringify(query)}`)
}

export const createImport = ({ data }) => {
  const form = new FormData()
  form.append('file', data.file)
  form.append('json_url', data.json_url)
  // Don't send body as 'body' param, otherwise it gets JSON.stringified
  return post('/site/import', {}, { body: form })
}

export function getItem(id) {
  return get(`/items/${id}`)
}

export function destroyItem(id) {
  return destroy(`/items/${id}`)
}

export function getItems(query) {
  return get(`/items?${queryString.stringify(query)}`)
}

export function updateItem(id, data) {
  return put(`/items/${id}`, { data })
}

export function createItem(data) {
  return post('/items', { data })
}

export function duplicateItem(id) {
  return post(`/items/${id}/duplicate`, {})
}

export function validateNewItem(data) {
  return post('/items/validate', { data })
}

export function validateItem(id, data) {
  return post(`/items/${id}/validate`, { data })
}

export function updateItemType(id, data) {
  return put(`/item-types/${id}`, { data })
}

export function destroyItemType(id) {
  return destroy(`/item-types/${id}`)
}

export function duplicateItemType(id) {
  return post(`/item-types/${id}/duplicate`, {})
}

export function getItemType(id) {
  return get(`/item-types/${id}`)
}

export function getItemTypes() {
  return get('/item-types')
}

export function createItemType(data) {
  return post('/item-types', { data })
}

export function updateMenuItem(id, data) {
  return put(`/menu-items/${id}`, { data })
}

export function destroyMenuItem(id) {
  return destroy(`/menu-items/${id}`)
}

export function getMenuItems() {
  return get('/menu-items')
}

export function createMenuItem(data) {
  return post('/menu-items', { data })
}

export function updateField(id, data) {
  return put(`/fields/${id}`, { data })
}

export function destroyField(id) {
  return destroy(`/fields/${id}`)
}

export function getFieldsForItemType(itemTypeId) {
  return get(`/item-types/${itemTypeId}/fields`)
}

export function createField(itemTypeId, data) {
  return post(`/item-types/${itemTypeId}/fields`, { data })
}


export function updateUpload(id, data) {
  return put(`/uploads/${id}`, { data })
}

export function destroyUpload(id) {
  return destroy(`/uploads/${id}`)
}

export function getUploads(query) {
  return get(`/uploads?${queryString.stringify(query)}`)
}

export function getUpload(id) {
  return get(`/uploads/${id}`)
}

export function createUpload(data) {
  return post('/uploads', { data })
}

export function updateSite(data) {
  return put('/site', { data })
}

export function deploySite(data) {
  return post('/deploys', { data })
}

export function abortDeploySite(env) {
  return destroy(`/site/links/${env}/deploys`)
}

export function updateUser(id, data) {
  return put(`/users/${id}`, { data })
}

export function destroyUser(id) {
  return destroy(`/users/${id}`)
}

export function getUser(id) {
  return get(`/users/${id}`)
}

export function getUsers() {
  return get('/users')
}

export function createUser(data) {
  return post('/users', { data })
}

export function createRole(data) {
  return post('/roles', { data })
}

export function updateRole(id, data) {
  return put(`/roles/${id}`, { data })
}

export function destroyRole(id) {
  return destroy(`/roles/${id}`)
}

export function getRole(id) {
  return get(`/roles/${id}`)
}

export function getRoles() {
  return get('/roles')
}

export function getEnvironment(id) {
  return get(`/environments/${id}`)
}

export function getEnvironments() {
  return get('/environments')
}

export function createEnvironment(data) {
  return post('/environments', { data })
}

export function updateEnvironment(id, data) {
  return put(`/environments/${id}`, { data })
}

export function destroyEnvironment(id) {
  return destroy(`/environments/${id}`)
}

export function updateAccessToken(id, data) {
  return put(`/access_tokens/${id}`, { data })
}

export function destroyAccessToken(id) {
  return destroy(`/access_tokens/${id}`)
}

export function getAccessToken(id) {
  return get(`/access_tokens/${id}`)
}

export function getAccessTokens() {
  return get('/access_tokens')
}

export function createAccessToken(data) {
  return post('/access_tokens', { data })
}

export function regenerateAccessToken(id) {
  return post(`/access_tokens/${id}/regenerate_token`, {})
}

export function testBearerToken(token) {
  return getRequest(
    `${config.apiBaseUrl}/users/me`,
    {
      headers: {
        'X-Site-Domain': siteDomain(),
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )
}

export function getDeployEvents() {
  return get('/deploy-events')
}

export function getDeployEvent(id) {
  return get(`/deploy-events/${id}`)
}

export function createPasswordReset(data) {
  return post('/users/reset_password', { data })
}

export function erdUrl() {
  const query = {
    site_domain: siteDomain(),
    auth_token: bearerToken(),
  }

  return `${config.apiBaseUrl}/site/diagram?${queryString.stringify(query)}`
}

export function dumpUrl() {
  // return get('/dumps/full_dump')
  const query = {
    site_domain: siteDomain(),
    auth_token: bearerToken(),
  }

  return `${config.apiBaseUrl}/dumps/full_dump?${queryString.stringify(query)}`
}

export function jsonUrl() {
  const query = {
    site_domain: siteDomain(),
    auth_token: bearerToken(),
  }

  return `${config.apiBaseUrl}/site/export?${queryString.stringify(query)}`
}
