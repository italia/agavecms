import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { reduxForm } from 'redux-form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'
import { SelectInput, Field, SubmitButton, Form } from 'components/form'
import deepClone from 'deep-clone'
import { connect } from 'react-redux'

class MenuItemForm extends Component {
  render() {
    const {
      error,
      dirty,
      valid,
      submitting,
      itemTypes,
      handleSubmit,
    } = this.props

    const itemTypeOptions = itemTypes.map((itemType) => {
      return {
        value: itemType.id,
        label: itemType.attributes.name,
      }
    })

    itemTypeOptions.unshift({ value: null, label: this.t('menuPage.noItemType') })

    return (
      <div>
        <Form error={error} onSubmit={handleSubmit}>
          <Field name="label" intlLabel="menuItem.label">
            <input type="text" />
          </Field>
          <Field name="itemTypeId" intlLabel="menuItem.itemType">
            <SelectInput options={itemTypeOptions} />
          </Field>
          <SubmitButton
            submitting={submitting}
            dirty={dirty}
            valid={valid}
            intlLabel="menuItem.button"
          />
        </Form>
      </div>
    )
  }
}

MenuItemForm.propTypes = {
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  itemTypes: PropTypes.array.isRequired,
  menuItem: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
}

const formConfig = {
  form: 'menuItem',
  validate: generateFormValidation({
    label: [validators.required()],
  }),
}

function mapStateToProps(state, props) {
  const data = props.menuItem.relationships.item_type.data
  return {
    initialValues: {
      label: props.menuItem.attributes.label,
      itemTypeId: data ? data.id : null,
    },
    onSubmit({ label, itemTypeId }) {
      const newMenuItem = deepClone(props.menuItem)
      newMenuItem.attributes.label = label
      if (itemTypeId) {
        newMenuItem.relationships.item_type.data = {
          type: 'item_type',
          id: itemTypeId,
        }
      } else {
        newMenuItem.relationships.item_type.data = null
      }
      return props.onSubmit(newMenuItem)
    },
  }
}

export default connect(mapStateToProps)(reduxForm(formConfig)(MenuItemForm))
