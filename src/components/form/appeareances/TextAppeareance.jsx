import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { Field, SelectInput } from 'components/form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'

class TextAppeareance extends Component {
  render() {
    const { namePrefix } = this.props

    const options = [
      { label: this.t('appareance.textAppeareance.markdown'), value: 'markdown' },
      { label: this.t('appareance.textAppeareance.html'), value: 'wysiwyg' },
      { label: this.t('appareance.textAppeareance.plain'), value: 'plain' },
    ]

    return (
      <Field
        name={`${namePrefix}.type`}
        intlLabel="field.appeareance"
        intlHint="field.appeareanceHint"
        required
      >
        <SelectInput options={options} />
      </Field>
    )
  }
}

TextAppeareance.propTypes = {
  namePrefix: PropTypes.string.isRequired,
}

export default {
  Component: TextAppeareance,
  validate: generateFormValidation({
    type: [validators.required()],
  }),
  fromJSON({ type = 'markdown' }) {
    return { type }
  },
  toJSON({ type }) {
    return { type }
  },
}
