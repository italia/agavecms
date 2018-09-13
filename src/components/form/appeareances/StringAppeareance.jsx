import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { Field, SelectInput } from 'components/form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'
import { getFieldsForItemType } from 'utils/storeQueries'

class StringAppeareance extends Component {
  render() {
    const { namePrefix } = this.props

    const options = [
      { label: this.t('appareance.stringAppareance.plain'), value: 'plain' },
      { label: this.t('appareance.stringAppareance.title'), value: 'title' },
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

StringAppeareance.propTypes = {
  namePrefix: PropTypes.string.isRequired,
}

export default {
  Component: StringAppeareance,
  validate: generateFormValidation({
    type: [validators.required()],
  }),
  fromJSON({ type }, state, props) {
    let realType = type

    if (!realType) {
      const itemType = state.itemTypes[props.itemTypeId]
      const fields = getFieldsForItemType(state, itemType)

      const titleField = fields.find(({ attributes }) => {
        return attributes.field_type === 'string' &&
          attributes.appeareance.type === 'title'
      })

      realType = titleField ? 'plain' : 'title'
    }

    return { type: realType }
  },
  toJSON({ type }) {
    return { type }
  },
}
