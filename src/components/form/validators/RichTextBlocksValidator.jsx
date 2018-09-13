import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { SelectInput, Field } from 'components/form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'
import { connect } from 'react-redux'
import _ from 'lodash'

class RichTextBlocksValidator extends Component {
  render() {
    const prefix = this.props.namePrefix

    const itemTypeOptions = this.props.itemTypes.map((itemType) => {
      return {
        value: itemType.id,
        label: itemType.attributes.name,
      }
    })

    return (
      <Field
        name={`${prefix}.item_types`}
        placeholder="Seleziona i modelli da usare come blocchi..."
      >
        <SelectInput
          multi
          options={itemTypeOptions}
        />
      </Field>
    )
  }
}

RichTextBlocksValidator.propTypes = {
  value: PropTypes.object.isRequired,
  fieldType: PropTypes.string.isRequired,
  namePrefix: PropTypes.string.isRequired,
  itemTypeId: PropTypes.string.isRequired,
  itemTypes: PropTypes.array,
}

function hasLocalizedFields(fields) {
  const refactorFields = _.chain(fields)
    .groupBy('relationships.item_type.data.id')
    .map((val, key) => {
      return {
        id: key,
        localized: _.map(val, 'attributes.localized')
      };
    })
    .value()

  const resultFields = Object.values(refactorFields)
    .filter(({ id, localized }) => !localized.some((el, idx, arr) => el === true))
    .map((item) => item.id)
  return { resultFields }
}

function mapStateToProps(state, props) {
  const notLocalizedItems = hasLocalizedFields(state.fields)
  const itemTypes = Object.values(state.itemTypes)
    .filter(({ id, attributes }) => id !== props.itemTypeId &&
      !attributes.singleton && notLocalizedItems.resultFields.includes(id))
  return { itemTypes }
}

export default {
  Component: connect(mapStateToProps)(RichTextBlocksValidator),
  isRequired: true,
  validate: generateFormValidation({
    item_types: [validators.minArrayLength(1)],
  }),
  fromJSON({ item_types: itemTypes }) {
    return { item_types: (itemTypes || []) }
  },
  toJSON({ item_types }) {
    return { item_types }
  },
  fields: ['item_types'],
}
