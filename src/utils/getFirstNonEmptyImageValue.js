export default function getFirstNonEmptyImageValue(item, fields) {
  const attributes = item.attributes

  const firstNonEmptyField = fields.find(f => !!attributes[f.attributes.api_key])
  if (fields.length === 0 || !firstNonEmptyField) {
    return undefined
  }
  let imageValue

  if (firstNonEmptyField.attributes.localized) {
    imageValue = Object.values(attributes[firstNonEmptyField.attributes.api_key]).find(l => !!l)
  } else {
    imageValue = attributes[firstNonEmptyField.attributes.api_key]
  }

  if (!imageValue) {
    return undefined
  }

  return imageValue.constructor === Array ? imageValue[0] : imageValue
}
