import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { Field, InputGroup, SelectInput } from 'components/form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'

class FormatValidator extends Component {
  render() {
    const currentType = this.props.value.type
    const prefix = this.props.namePrefix

    const options = [
      { value: 'url', label: this.t('validators.format.url') },
      { value: 'email', label: this.t('validators.format.email') },
      { value: 'custom', label: this.t('validators.format.custom') },
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
          currentType === 'custom' &&
            <Field
              name={`${prefix}.custom`}
              showLabel={false}
              intlHint="validators.format.hint"
              intlPlaceholder="validators.format.placeholder"
            >
              <InputGroup
                className="input-group--code"
                pre="/"
                post="/"
                type="text"
              />
            </Field>
        }
      </div>
    )
  }
}

FormatValidator.propTypes = {
  value: PropTypes.object.isRequired,
  namePrefix: PropTypes.string.isRequired,
}

export default {
  Component: FormatValidator,
  validate: generateFormValidation({
    type: [validators.oneOf(['custom', 'email', 'url'])],
    custom: [validators.requiredIf(d => d.type === 'custom')],
  }),
  fromJSON({ custom_pattern: custom, predefined_pattern: predefined }) {
    if (custom) {
      return { type: 'custom', custom }
    } else if (predefined) {
      return { type: predefined }
    }

    return { type: 'url' }
  },
  toJSON({ type, custom }) {
    if (type === 'url') {
      return { predefined_pattern: 'url' }
    }

    if (type === 'email') {
      return { predefined_pattern: 'email' }
    }

    return { custom_pattern: custom }
  },
  fields: ['type', 'custom'],
}
