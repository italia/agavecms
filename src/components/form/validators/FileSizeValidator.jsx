import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { Field, SelectInput } from 'components/form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'

class FileSizeValidator extends Component {
  render() {
    const currentType = this.props.value.type
    const prefix = this.props.namePrefix

    const options = [
      { value: 'between', label: this.t('validators.file_size.between') },
      { value: 'min', label: this.t('validators.file_size.min') },
      { value: 'max', label: this.t('validators.file_size.max') },
    ]

    const units = [
      { value: 'MB', label: this.t('validators.file_size.unit.mib') },
      { value: 'KB', label: this.t('validators.file_size.unit.kib') },
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
              name={`${prefix}.min_value`}
              showLabel={false}
              intlPlaceholder="validators.file_size.minValue"
              inline
            >
              <input type="text" size="6" />
            </Field>
        }
        {
          (currentType === 'min' || currentType === 'between') &&
            <Field
              name={`${prefix}.min_unit`}
              showLabel={false}
              placeholder="..."
              inline
            >
              <SelectInput options={units} />
            </Field>
        }
        {
          currentType === 'between' &&
            <span>{this.t('validators.file_size.and')}</span>
        }
        {
          (currentType === 'max' || currentType === 'between') &&
            <Field
              name={`${prefix}.max_value`}
              showLabel={false}
              intlPlaceholder="validators.file_size.maxValue"
              inline
            >
              <input type="text" size="6" />
            </Field>
        }
        {
          (currentType === 'max' || currentType === 'between') &&
            <Field
              name={`${prefix}.max_unit`}
              showLabel={false}
              placeholder="..."
              inline
            >
              <SelectInput options={units} />
            </Field>
        }
      </div>
    )
  }
}

FileSizeValidator.propTypes = {
  value: PropTypes.object.isRequired,
  namePrefix: PropTypes.string.isRequired,
}

const validations = {
  between: generateFormValidation({
    min_value: [validators.positiveInteger()],
    min_unit: [validators.required(), validators.fileSizeUnit()],
    max_value: [validators.positiveInteger()],
    max_unit: [validators.required(), validators.fileSizeUnit()],
  }),
  min: generateFormValidation({
    min_value: [validators.positiveInteger()],
    min_unit: [validators.required(), validators.fileSizeUnit()],
  }),
  max: generateFormValidation({
    max_value: [validators.positiveInteger()],
    max_unit: [validators.required(), validators.fileSizeUnit()],
  }),
}

export default {
  Component: FileSizeValidator,
  validate(value) {
    return validations[value.type](value)
  },
  fromJSON({ min_value, min_unit, max_value, max_unit }) {
    const filled = v => v !== undefined && v !== null

    if (filled(min_value) && !filled(max_value)) {
      return { type: 'min', min_value, min_unit }
    } else if (filled(max_value) && !filled(min_value)) {
      return { type: 'max', max_value, max_unit }
    }

    return { type: 'between', min_value, min_unit, max_value, max_unit }
  },
  toJSON({ type, min_value, min_unit, max_value, max_unit }) {
    switch (type) {
      case 'between':
        return { min_value, min_unit, max_value, max_unit }
      case 'min':
        return { min_value, min_unit }
      default:
        return { max_value, max_unit }
    }
  },
  fields: ['type', 'min_value', 'min_unit', 'max_value', 'max_unit'],
}
