import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { Field, SelectInput } from 'components/form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'

class LengthValidator extends Component {
  render() {
    const currentType = this.props.value.type
    const prefix = this.props.namePrefix

    const options = [
      { value: 'between', label: this.t('validators.length.between') },
      { value: 'min', label: this.t('validators.length.min') },
      { value: 'max', label: this.t('validators.length.max') },
      { value: 'eq', label: this.t('validators.length.eq') },
    ]

    return (
      <div className="form__field-group">
        <Field name={`${prefix}.type`} showLabel={false} inline>
          <SelectInput
            clearable={false}
            options={options}
            style={{ width: 160 }}
          />
        </Field>
        {
          (currentType === 'min' || currentType === 'between') &&
            <Field
              name={`${prefix}.min`}
              showLabel={false}
              intlPlaceholder="validators.length.minValue"
              inline
            >
              <input type="text" size="6" />
            </Field>
        }
        {
          currentType === 'between' &&
            <span>{this.t('validators.length.and')}</span>
        }
        {
          (currentType === 'max' || currentType === 'between') &&
            <Field
              name={`${prefix}.max`}
              showLabel={false}
              intlPlaceholder="validators.length.maxValue"
              inline
            >
              <input type="text" size="6" />
            </Field>
        }
        {
          currentType === 'eq' &&
            <Field
              name={`${prefix}.eq`}
              showLabel={false}
              intlPlaceholder="validators.length.eqValue"
              inline
            >
              <input type="text" size="6" />
            </Field>
        }
      </div>
    )
  }
}

LengthValidator.propTypes = {
  value: PropTypes.object.isRequired,
  namePrefix: PropTypes.string.isRequired,
}

const validations = {
  between: generateFormValidation({
    min: [validators.positiveInteger()],
    max: [validators.positiveInteger(), validators.greaterThan('min')],
  }),
  min: generateFormValidation({
    min: [validators.positiveInteger()],
  }),
  max: generateFormValidation({
    max: [validators.positiveInteger()],
  }),
  eq: generateFormValidation({
    eq: [validators.positiveInteger()],
  }),
}

export default {
  Component: LengthValidator,
  validate(value) {
    return validations[value.type](value)
  },
  fromJSON({ min, max, eq }) {
    const filled = v => v !== undefined && v !== null

    if (filled(min) && !filled(max)) {
      return { type: 'min', min }
    } else if (filled(max) && !filled(min)) {
      return { type: 'max', max }
    } else if (filled(eq)) {
      return { type: 'eq', eq }
    }

    return { type: 'between', min, max }
  },
  toJSON({ type, min, max, eq }) {
    switch (type) {
      case 'between':
        return { min, max }
      case 'eq':
        return { eq }
      case 'min':
        return { min }
      default:
        return { max }
    }
  },
  fields: ['type', 'min', 'max', 'eq'],
}
