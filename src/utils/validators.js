const normalizeString = function normalizeString(val) {
  const value = val || ''
  return value.toString().trim()
}

export default {
  email() {
    return function emailValidator(value) {
      const re = /^\S+@\S+\.\S+$/
      if (!re.test(normalizeString(value))) {
        return { id: 'INVALID_EMAIL' }
      }

      return false
    }
  },

  url() {
    return function urlValidator(val) {
      const re = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
      const value = normalizeString(val)

      if (value && !re.test(value)) {
        return { id: 'INVALID_URL' }
      }

      return false
    }
  },

  objectRequired() {
    return function objectRequiredValidator(val) {
      if (!val) {
        return { id: 'REQUIRED_FIELD' }
      }

      return false
    }
  },

  required() {
    return function requiredValidator(val) {
      if (normalizeString(val).length === 0) {
        return { id: 'REQUIRED_FIELD' }
      }

      return false
    }
  },

  requiredIf(condition) {
    return function requiredIfValidator(val, data) {
      if (condition(data) && normalizeString(val).length === 0) {
        return { id: 'REQUIRED_FIELD' }
      }

      return false
    }
  },

  minArrayLength(minLength) {
    return function minArrayLengthValidator(value) {
      if (!value || value.length < minLength) {
        return {
          id: 'MIN_ARRAY_LENGTH',
          values: { min_length: minLength },
        }
      }

      return false
    }
  },

  minLength(minLength) {
    return function minLengthValidator(val) {
      const value = normalizeString(val)

      if (value.length < minLength) {
        return {
          id: 'MIN_LENGTH',
          values: { min_length: minLength },
        }
      }

      return false
    }
  },

  maxLength(maxLength) {
    return function maxLengthValidator(val) {
      const value = normalizeString(val)
      if (value.length > maxLength) {
        return {
          id: 'MAX_LENGTH',
          values: { max_length: maxLength },
        }
      }

      return false
    }
  },

  acceptance() {
    return function acceptanceValidator(value) {
      if (value !== true) {
        return { id: 'ACCEPTANCE_REQUIRED' }
      }

      return false
    }
  },

  greaterDateThan(field) {
    return function greaterDateThanValidator(value, data) {
      if (
        data[field] && value &&
        value <= data[field]
      ) {
        return { id: 'GREATER_DATE_THAN' }
      }

      return false
    }
  },

  greaterThan(field) {
    return function greaterThanValidator(value, data) {
      if (
        data[field] &&
        parseFloat(value, 10) <= parseFloat(data[field], 10)
      ) {
        return { id: 'GREATER_THAN' }
      }

      return false
    }
  },

  positiveInteger() {
    return function integerValidator(value) {
      const n = ~~Number(value)
      const valid = String(n) === value && n >= 0
      if (!valid) {
        return { id: 'INTEGER' }
      }

      return false
    }
  },

  integer() {
    return function integerValidator(value) {
      const n = ~~Number(value)
      const valid = String(n) === value
      if (!valid) {
        return { id: 'INTEGER' }
      }

      return false
    }
  },

  floatingPoint() {
    return function floatingPointValidator(value) {
      if (isNaN(parseFloat(value))) {
        return { id: 'FLOAT' }
      }

      return false
    }
  },

  sameAs(field) {
    return function sameAsValidator(value, data) {
      if (value !== data[field]) {
        return { id: 'NOT_EQUAL_FIELD' }
      }

      return false
    }
  },

  minImageWidth(minWidth) {
    return function minImageWidthValidator(value) {
      if (value && value.width < minWidth) {
        return {
          id: 'MIN_IMAGE_WIDTH',
          values: { min_width: minWidth },
        }
      }

      return false
    }
  },

  minImageHeight(minHeight) {
    return function minImageHeightValidator(value) {
      if (value && value.height < minHeight) {
        return {
          id: 'MIN_IMAGE_HEIGHT',
          values: { min_height: minHeight },
        }
      }

      return false
    }
  },

  ifNotEmpty(validator) {
    return function ifNotEmptyValidator(value) {
      if (value) {
        return validator(value)
      }

      return false
    }
  },

  squareImage() {
    return function squareImageValidator(value) {
      if (value && value.height !== value.width) {
        return { id: 'SQUARE_IMAGE' }
      }
      return false
    }
  },

  oneOf(options) {
    return function oneOfValidator(value) {
      if (value && !options.includes(value)) {
        return { id: 'ONE_OF' }
      }
      return false
    }
  },

  json() {
    return function jsonValidator(value) {
      if (value) {
        try {
          JSON.parse(value)
          return false
        } catch (e) {
          return { id: 'JSON' }
        }
      }
      return false
    }
  },

  fileSizeUnit() {
    return this.oneOf(['MB', 'KB'])
  },
}
