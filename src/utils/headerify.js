import titleize from 'utils/titleize'

export default function headerify(string) {
  return string.split(/\-/).map(x => titleize(x)).join('-')
}
