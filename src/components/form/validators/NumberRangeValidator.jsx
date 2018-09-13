import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { Field, SelectInput } from 'components/form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'

class NumberRangeValidator extends Component {
  render() {
    const currentType = this.props.value.type
    const prefix = this.props.namePrefix

    const options = [
      { value: 'between', label: this.t('validators.number_range.between') },
      { value: 'min', label: this.t('validators.number_range.min') },
      { value: 'max', label: this.t('validators.number_range.max') },
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
              intlPlaceholder="validators.number_range.minValue"
              inline
            >
              <input type="text" size="6" />
            </Field>
        }
        {
          currentType === 'between' &&
            <span>{this.t('validators.number_range.and')}</span>
        }
        {
          (currentType === 'max' || currentType === 'between') &&
            <Field
              name={`${prefix}.max`}
              showLabel={false}
              intlPlaceholder="validators.number_range.maxValue"
              inline
            >
              <input type="text" size="6" />
            </Field>
        }
      </div>
    )
  }
}

NumberRangeValidator.propTypes = {
  value: PropTypes.object.isRequired,
  namePrefix: PropTypes.string.isRequired,
}

const validations = {
  between: generateFormValidation({
    min: [validators.floatingPoint()],
    max: [validators.floatingPoint(), validators.greaterThan('min')],
  }),
  min: generateFormValidation({
    min: [validators.floatingPoint()],
  }),
  max: generateFormValidation({
    max: [validators.floatingPoint()],
  }),
}

export default {
  Component: NumberRangeValidator,
  validate(value) {
    return validations[value.type](value)
  },
  fromJSON({ min, max }) {
    const filled = v => v !== undefined && v !== null

    if (filled(min) && !filled(max)) {
      return { type: 'min', min }
    } else if (filled(max) && !filled(min)) {
      return { type: 'max', max }
    }

    return { type: 'between', min, max }
  },
  toJSON({ type, min, max }) {
    switch (type) {
      case 'between':
        return { min, max }
      case 'min':
        return { min }
      default:
        return { max }
    }
  },
  fields: ['type', 'min', 'max'],
}
