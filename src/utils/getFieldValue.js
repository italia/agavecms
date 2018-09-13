export default function getFieldValue(item, field, locales) {
  if (!field) {
    return undefined
  }

  if (field.attributes.localized) {
    return item.attributes[field.attributes.api_key] &&
      item.attributes[field.attributes.api_key][locales[0]]
  }

  return item.attributes[field.attributes.api_key]
}
