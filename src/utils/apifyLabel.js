export default function apifyLabel(value) {
  const newValue = value.toLowerCase().replace(/[^a-z0-9]+/g, '_')
  return newValue.replace(/(^_|_$)/g, '')
}
