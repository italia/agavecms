export default function generateEmptyField(fieldType) {
  const validators = {}

  if (fieldType === 'slug') {
    validators.unique = {}
  }

  return {
    type: 'field',
    attributes: {
      label: '',
      api_key: '',
      hint: '',
      field_type: fieldType,
      validators,
      localized: false,
      appeareance: {},
      position: 99,
    },
  }
}
