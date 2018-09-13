import md5 from 'min-md5'
import queryString from 'query-string'

export default function gravatar(email, options) {
  return `https://secure.gravatar.com/avatar/${md5(email)}?${queryString.stringify(options)}`
}
