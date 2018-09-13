import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { Field } from 'components/form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'

class EnumValidator extends Component {
  render() {
    const prefix = this.props.namePrefix

    return (
      <div>
        <Field
          name={`${prefix}.csv`}
          intlPlaceholder="validators.enum.valuePlaceholder"
          intlHint="validators.enum.hint"
        >
          <input type="text" />
        </Field>
      </div>
    )
  }
}

EnumValidator.propTypes = {
  value: PropTypes.object.isRequired,
  namePrefix: PropTypes.string.isRequired,
}

export default {
  Component: EnumValidator,
  validate: generateFormValidation({
    csv: [validators.required()],
  }),
  fromJSON({ values = [] }) {
    return { csv: values.join(', ') }
  },
  toJSON({ csv }) {
    return { values: csv.split(/\s*,\s*/) }
  },
  fields: ['csv'],
}
