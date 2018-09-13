import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { Field, SelectInput } from 'components/form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'

class LinkAppeareance extends Component {
  render() {
    const { namePrefix } = this.props

    const options = [
      { label: this.t('appareance.linkAppareance.select'), value: 'select' },
      { label: this.t('appareance.linkAppareance.embed'), value: 'embed' },
    ]

    return (
      <Field
        required
        name={`${namePrefix}.type`}
        intlLabel="field.appeareance"
        intlHint="field.appeareanceHint"
      >
        <SelectInput options={options} />
      </Field>
    )
  }
}

LinkAppeareance.propTypes = {
  namePrefix: PropTypes.string.isRequired,
}

export default {
  Component: LinkAppeareance,
  validate: generateFormValidation({
    type: [validators.required()],
  }),
  fromJSON({ type = 'select' }) {
    return { type }
  },
  toJSON({ type }) {
    return { type }
  },
}
