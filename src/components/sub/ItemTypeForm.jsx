import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { reduxForm, formValueSelector, change } from 'redux-form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'
import apifyLabel from 'utils/apifyLabel'
import { SwitchInput, Field, SubmitButton, SelectInput, Form } from 'components/form'
import deepClone from 'deep-clone'
import { connect } from 'react-redux'
import pick from 'object.pick'

class ItemTypeForm extends Component {
  render() {
    const {
      error,
      valid,
      dirty,
      submitting,
      isSingleton,
      orderingMethod,
      dispatch,
      isNewItemType,
      handleSubmit,
      fields,
    } = this.props

    const methodOptions = [
      { value: 'auto', label: 'Order records by update time' },
      { value: 'field', label: 'Order records by one of its fields' },
      { value: 'manual', label: 'Records can be sorted by editors via drag & drop' },
      { value: 'tree', label: 'Records can be organized in a tree by editors' },
    ]

    const directionOptions = [
      { value: 'asc', label: 'Ascendent' },
      { value: 'desc', label: 'Descendent' },
    ]

    const allowedFieldTypes = [
      'string', 'date', 'date_time', 'boolean', 'integer', 'float',
    ]

    const fieldType = (field) => this.t(`fieldType.${field.attributes.field_type}`)

    const fieldOptions = fields
      .filter(field => allowedFieldTypes.includes(field.attributes.field_type))
      .sort((a, b) => a.attributes.position - b.attributes.position)
      .map(field => ({
        value: field.id,
        label: `${field.attributes.label} (${fieldType(field)})`,
      }))

    return (
      <Form error={error} onSubmit={handleSubmit}>
        <Field
          name="name"
          intlLabel="itemType.name"
          intlPlaceholder="itemType.name.placeholder"
          intlHint="itemType.name.hint"
          wrapInput={
            (input) => {
              return Object.assign({}, input, {
                onChange(e) {
                  const result = input.onChange(e)
                  if (isNewItemType) {
                    dispatch(change('itemType', 'api_key', apifyLabel(e.target.value)))
                  }
                  return result
                },
              })
            }
          }
        >
          <input type="text" className="form__input--large" autoFocus />
        </Field>
        <Field
          name="api_key"
          intlLabel="itemType.api_key"
          intlPlaceholder="itemType.api_key.placeholder"
          intlHint="itemType.api_key.hint"
        >
          <input type="text" className="form__input--code" />
        </Field>
        <Field
          name="singleton"
          intlLabel="itemType.singleton"
          intlHint="itemType.singleton.hint"
        >
          <SwitchInput />
        </Field>
        {
          !isSingleton &&
            <div className="space--bottom-2">
              <Field
                name="ordering_method"
                intlLabel="itemType.orderingMethod"
              >
                <SelectInput
                  clearable={false}
                  options={methodOptions}
                  style={{ width: '100%' }}
                />
              </Field>
              {
                orderingMethod === 'field' &&
                  <div className="form__field">
                    <div className="form__label">
                      Ordering field
                    </div>
                    <div className="grid">
                      <div className="grid__item desk-8-12">
                        <Field
                          showLabel={false}
                          name="ordering_field_id"
                          intlLabel="itemType.orderingField"
                        >
                          <SelectInput
                            clearable={false}
                            options={fieldOptions}
                            style={{ width: '100%' }}
                          />
                        </Field>
                      </div>
                      <div className="grid__item desk-4-12">
                        <Field
                          showLabel={false}
                          name="ordering_direction"
                          intlLabel="itemType.orderingDirection"
                        >
                          <SelectInput
                            clearable={false}
                            options={directionOptions}
                            style={{ width: '100%' }}
                          />
                        </Field>
                      </div>
                    </div>
                  </div>
              }
            </div>
        }
        <SubmitButton
          submitting={submitting}
          dirty={dirty}
          valid={valid}
          intlLabel="itemType.button"
        />
      </Form>
    )
  }
}

ItemTypeForm.propTypes = {
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  itemType: PropTypes.object.isRequired,
  isNewItemType: PropTypes.bool,
  isSingleton: PropTypes.bool,
  orderingMethod: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  apiKey: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
}

const formConfig = {
  form: 'itemType',
  validate: generateFormValidation({
    name: [validators.required()],
    api_key: [validators.required()],
    ordering_method: [validators.required()],
    ordering_field_id: [validators.requiredIf((data) => data.ordering_method === 'field')],
    ordering_direction: [validators.requiredIf((data) => data.ordering_method === 'field')],
  }),
}

const selector = formValueSelector('itemType')

function mapStateToProps(state, props) {
  const initialValues = pick(props.itemType.attributes, ['name', 'api_key', 'singleton'])
  initialValues.ordering_direction = 'asc'

  if (props.itemType.attributes.singleton) {
    initialValues.ordering_method = 'auto'
  } else if (props.itemType.attributes.sortable) {
    initialValues.ordering_method = 'manual'
  } else if (props.itemType.attributes.tree) {
    initialValues.ordering_method = 'tree'
  } else if (props.itemType.relationships.ordering_field.data) {
    initialValues.ordering_method = 'field'
    initialValues.ordering_field_id = props.itemType.relationships.ordering_field.data.id
    initialValues.ordering_direction = props.itemType.attributes.ordering_direction
  } else {
    initialValues.ordering_method = 'auto'
  }

  const fields = Object.values(state.fields)
    .filter(({ relationships }) => relationships.item_type.data.id === props.itemType.id)

  return {
    fields,
    initialValues,
    isNewItemType: !props.itemType.id,
    isSingleton: selector(state, 'singleton'),
    orderingMethod: selector(state, 'ordering_method'),
    onSubmit(value) {
      const newItemType = deepClone(props.itemType)

      newItemType.attributes = pick(value, ['name', 'api_key', 'singleton'])
      newItemType.attributes.sortable = false
      newItemType.attributes.tree = false
      newItemType.attributes.ordering_direction = null
      newItemType.relationships = {
        ordering_field: {
          data: null,
        },
      }

      if (value.singleton) {
        // NOP
      } else if (value.ordering_method === 'field') {
        newItemType.attributes.ordering_direction = value.ordering_direction || null
        newItemType.relationships.ordering_field.data = {
          type: 'field',
          id: value.ordering_field_id,
        }
      } else if (value.ordering_method === 'manual') {
        newItemType.attributes.sortable = true
      } else if (value.ordering_method === 'tree') {
        newItemType.attributes.tree = true
      }

      return props.onSubmit(newItemType)
    },
  }
}

export default connect(mapStateToProps)(reduxForm(formConfig)(ItemTypeForm))
