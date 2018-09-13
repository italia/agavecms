import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { reduxForm } from 'redux-form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'
import { Field, SelectInput, SubmitButton, Form } from 'components/form'
import deepClone from 'deep-clone'
import { connect } from 'react-redux'
import pick from 'object.pick'
import omit from 'object.omit'
import CopyToClipboard from 'components/sub/CopyToClipboard'

class AccessTokenForm extends Component {
  render() {
    const {
      error,
      submitting,
      dirty,
      valid,
      accessToken,
      handleSubmit,
      roles,
    } = this.props

    const roleOptions = roles.map((role) => (
      { value: role.id, label: role.attributes.name }
    ))

    return (
      <Form error={error} onSubmit={handleSubmit}>
        <Field name="name" intlLabel="accessToken.name">
          <input
            type="text"
            disabled={accessToken.attributes.hardcoded_type}
          />
        </Field>
        {
          !accessToken.attributes.hardcoded_type &&
            <Field name="role" intlLabel="accessToken.role">
              <SelectInput clearable={false} options={roleOptions} />
            </Field>
        }
        {
          accessToken.attributes.token &&
            <div className="form__field">
              <div className="form__label">
                API key
              </div>
              <CopyToClipboard
                className="form__input--code"
                value={accessToken.attributes.token}
              />
            </div>
        }
        <SubmitButton
          submitting={submitting}
          dirty={dirty}
          valid={valid}
          intlLabel="accessToken.button"
        />
      </Form>
    )
  }
}

AccessTokenForm.propTypes = {
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  accessToken: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  roles: PropTypes.array.isRequired,
}

const formConfig = {
  form: 'accessToken',
}

function mapStateToProps(state, props) {
  const accessToken = props.accessToken

  const roles = Object.values(state.roles)

  const validations = {
    name: [validators.required()],
  }

  const initialValues = pick(props.accessToken.attributes, ['name'])

  if (!accessToken.attributes.hardcoded_type) {
    validations.role = [validators.required()]
    initialValues.role = props.accessToken.relationships.role.data &&
      props.accessToken.relationships.role.data.id
  }

  return {
    enableReinitialize: true,
    validate: generateFormValidation(validations),
    initialValues,
    roles,
    onSubmit(value) {
      const newAccessToken = deepClone(props.accessToken)
      newAccessToken.attributes = omit(value, ['role'])
      newAccessToken.relationships.role.data = {
        id: value.role,
        type: 'role',
      }

      return props.onSubmit(newAccessToken)
    },
  }
}

export default connect(mapStateToProps)(reduxForm(formConfig)(AccessTokenForm))
