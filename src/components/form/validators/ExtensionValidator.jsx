import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { Field } from 'components/form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'

class ExtensionValidator extends Component {
  render() {
    const prefix = this.props.namePrefix

    return (
      <div>
        <Field
          name={`${prefix}.csv`}
          intlPlaceholder="validators.extension.valuePlaceholder"
          intlHint="validators.extension.hint"
        >
          <input type="text" />
        </Field>
      </div>
    )
  }
}

ExtensionValidator.propTypes = {
  value: PropTypes.object.isRequired,
  namePrefix: PropTypes.string.isRequired,
}

export default {
  Component: ExtensionValidator,
  validate: generateFormValidation({
    csv: [validators.required()],
  }),
  fromJSON({ extensions = [] }) {
    return { csv: extensions.join(', ') }
  },
  toJSON({ csv }) {
    return { extensions: csv.split(/\s*,\s*/) }
  },
  fields: ['csv'],
}
