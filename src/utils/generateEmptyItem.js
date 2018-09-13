export default function generateEmptyItem(locales, fields, itemType) {
  const attributes = fields.reduce(
    (acc, field) => {
      let value
      if (field.attributes.localized) {
        value = locales.reduce(
          (acc2, locale) => Object.assign({ [locale]: null }, acc2),
            {}
        )
      } else {
        value = null
      }
      return Object.assign({ [field.attributes.api_key]: value }, acc)
    },
    {}
  )

  if (itemType.attributes.sortable) {
    attributes.position = 0
  }

  return {
    type: 'item',
    attributes,
    relationships: {
      item_type: {
        data: { type: 'item_type', id: itemType.id },
      },
    },
  }
}
