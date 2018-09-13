function validate(fieldRules, values) {
  return Object.entries(fieldRules).reduce((errors, [field, rules]) => {
    if (!Array.isArray(rules)) {
      if (Array.isArray(values[field])) {
        return Object.assign({
          [field]: values[field].map(v => validate(rules, v || {})),
        }, errors)
      }

      return Object.assign({
        [field]: validate(rules, values[field] || {}),
      }, errors)
    }

    const error = rules
      .map(rule => rule(values[field], values))
      .find(v => !!v)

    if (error) {
      return Object.assign({ [field]: error }, errors)
    }

    return errors
  }, {})
}

export default function generateFormValidation(fieldRules) {
  return validate.bind(this, fieldRules)
}
