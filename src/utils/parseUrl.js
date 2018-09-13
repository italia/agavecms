import pick from 'object.pick'

const properties = ['protocol', 'hostname', 'port', 'pathname', 'search', 'hash', 'host']

export default function parseUrl(url) {
  const el = document.createElement('a')
  el.href = url
  return pick(el, properties)
}
