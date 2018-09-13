import queryString from 'query-string'
import store from 'store'

export default function imageUrl(file, params) {
  if (file.thumbnail_url) {
    return file.thumbnail_url
  }

  if (Array.isArray(file)) {
    if (file.length > 0) {
      return imageUrl(file[0], params)
    }

    return null
  }

  const path = file.path.startsWith('/') ?
    file.path.slice(1) :
    file.path

  const baseUrl = `${store.getState().site.attributes.image_host}/`

  let url = baseUrl + path

  if (params) {
    url += `?${queryString.stringify(params)}`
  }

  return url
}

export function hasPreviewImage(file) {
  const viewFormats = ['gif', 'img', 'jpeg', 'jpg', 'png', 'svg']

  if (!file || (Array.isArray(file) && file.length === 0)) {
    return false
  }

  if (
    (file.thumbnail_url || file.path) &&
      viewFormats.includes(file.format)
  ) {
    return true
  }

  return false
}
