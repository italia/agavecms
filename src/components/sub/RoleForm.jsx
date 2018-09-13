import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { reduxForm, FieldArray } from 'redux-form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'
import { Field, SubmitButton, SwitchInput, SelectInput, Form } from 'components/form'
import deepClone from 'deep-clone'
import { connect } from 'react-redux'
import omit from 'object.omit'

const renderPermissions = ({ itemTypes, fields, meta: { touched, error } }) => {
  const actionOptions = [
    { label: 'All actions', value: 'all' },
    { label: 'Read', value: 'read' },
    { label: 'Create', value: 'create' },
    { label: 'Update', value: 'update' },
    { label: 'Delete', value: 'delete' },
  ]

  const itemTypeOptions = [
    { value: 'all', label: 'All models' },
  ].concat(
    itemTypes.map((itemType) => {
      return {
        value: itemType.id,
        label: itemType.attributes.name,
      }
    })
  )

  return (
    <div>
      {touched && error && <span>{error}</span>}
      {
        fields.map((permission, i) => (
          <div className="grid grid--middle grid--narrow" key={i}>
            <div className="grid__item desk-3-12">
              <Field name={`${permission}.action`}>
                <SelectInput clearable={false} options={actionOptions} />
              </Field>
            </div>
            <div className="grid__item desk-4-12">
              <Field name={`${permission}.item_type`}>
                <SelectInput clearable={false} options={itemTypeOptions} />
              </Field>
            </div>
            <div className="grid__item desk-1-12">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  fields.remove(i)
                }}
              >
                <i className="icon--delete" />
              </a>
            </div>
          </div>
        ))
      }
      <div className="space--top-1">
        <a
          href="#"
          className="button button--tiny"
          onClick={(e) => {
            e.preventDefault()
            fields.push()
          }}
        >
          <i className="icon--add" />
          <span>Add new rule</span>
        </a>
      </div>
    </div>
  )
}

renderPermissions.propTypes = {
  itemTypes: PropTypes.array.isRequired,
  fields: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
}

class RoleForm extends Component {
  render() {
    const {
      error,
      submitting,
      dirty,
      valid,
      handleSubmit,
      itemTypes,
    } = this.props

    return (
      <Form error={error} onSubmit={handleSubmit}>
        <Field name="name" intlLabel="role.name">
          <input type="text" className="form__input--large" />
        </Field>
        <Field name="can_edit_schema" intlLabel="role.canEditSchema">
          <SwitchInput />
        </Field>
        <Field name="can_edit_site" intlLabel="role.canEditSite">
          <SwitchInput />
        </Field>
        <Field name="can_edit_favicon" intlLabel="role.canEditFavicon">
          <SwitchInput />
        </Field>
        <Field name="can_dump_data" intlLabel="role.canDumpData">
          <SwitchInput />
        </Field>
        <Field name="can_import_and_export" intlLabel="role.canImportAndExport">
          <SwitchInput />
        </Field>
        <Field name="can_manage_users" intlLabel="role.canManageUsers">
          <SwitchInput />
        </Field>
        <Field name="can_publish_to_production" intlLabel="role.canPublishToProduction">
          <SwitchInput />
        </Field>
        <Field name="can_manage_access_tokens" intlLabel="role.canManageAccessTokens">
          <SwitchInput />
        </Field>
        <div className="form__field">
          <div className="form__label">
            Users/Access tokens on this role can:
          </div>
          <FieldArray
            name="positive"
            itemTypes={itemTypes}
            component={renderPermissions}
          />
        </div>
        <div className="form__field">
          <div className="form__label">
            Users/Access tokens on this role <strong>cannot</strong>:
          </div>
          <FieldArray
            name="negative"
            itemTypes={itemTypes}
            component={renderPermissions}
          />
        </div>
        <SubmitButton
          submitting={submitting}
          dirty={dirty}
          valid={valid}
          intlLabel="role.button"
        />
      </Form>
    )
  }
}

RoleForm.propTypes = {
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  role: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  itemTypes: PropTypes.array.isRequired,
}

const formConfig = {
  form: 'role',
}

function serializePermissions(permissions) {
  return (permissions || [])
    .map(p => (
      Object.assign({}, p, { item_type: p.item_type || 'all' })
    ))
}

function deserializePermissions(permissions) {
  return (permissions || [])
    .map(p => (
      Object.assign({}, p, { item_type: p.item_type === 'all' ? null : p.item_type })
    ))
}

function mapStateToProps(state, props) {
  const validations = {
    name: [validators.required()],
    positive: {
      action: [validators.required()],
      item_type: [validators.required()],
    },
    negative: {
      action: [validators.required()],
      item_type: [validators.required()],
    },
  }

  const itemTypes = Object.values(state.itemTypes)
    .sort((a, b) => a.attributes.name.localeCompare(b.attributes.name))

  const initialValues = Object.assign({}, props.role.attributes, {
    positive: serializePermissions(
      props.role.attributes.positive_item_type_permissions
    ),
    negative: serializePermissions(
      props.role.attributes.negative_item_type_permissions
    ),
  })

  return {
    enableReinitialize: true,
    validate: generateFormValidation(validations),
    initialValues,
    itemTypes,
    onSubmit(value) {
      const attributes = omit(value, ['positive', 'negative'])
      const newRole = deepClone(props.role)

      newRole.attributes = Object.assign(
        attributes,
        {
          positive_item_type_permissions: deserializePermissions(value.positive),
          negative_item_type_permissions: deserializePermissions(value.negative),
        }
      )

      return props.onSubmit(newRole)
    },
  }
}

export default connect(mapStateToProps)(reduxForm(formConfig)(RoleForm))
