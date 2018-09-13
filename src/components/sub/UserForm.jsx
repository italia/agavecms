import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { reduxForm } from 'redux-form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'
import { Field, SelectInput, SubmitButton, Form } from 'components/form'
import deepClone from 'deep-clone'
import { getCurrentUser, getCurrentRole } from 'utils/storeQueries'
import { connect } from 'react-redux'
import pick from 'object.pick'
import omit from 'object.omit'
import CopyToClipboard from 'components/sub/CopyToClipboard'

class UserForm extends Component {
  render() {
    const {
      error,
      submitting,
      dirty,
      valid,
      handleSubmit,
      canManageUsers,
      isCurrentUser,
      user,
      roles,
    } = this.props

    const roleOptions = roles.map((role) => (
      { value: role.id, label: role.attributes.name }
    ))

    return (
      <Form error={error} onSubmit={handleSubmit}>
        {
          canManageUsers && user.attributes.activate_url &&
            <div className="form__field">
              <div className="form__label">
                Invitation or Reset Password Link
              </div>
              <CopyToClipboard
                className="form__input--code"
                value={user.attributes.activate_url}
              />
            </div>
        }
        <Field name="email" intlLabel="editor.email">
          <input type="email" disabled={user.id && !isCurrentUser} />
        </Field>
        <div className="grid space--bottom-2">
          <div className="grid__item desk-6-12">
            <Field name="first_name" intlLabel="editor.firstName">
              <input type="text" disabled={user.id && !isCurrentUser} />
            </Field>
          </div>
          <div className="grid__item desk-6-12">
            <Field name="last_name" intlLabel="editor.lastName">
              <input type="text" disabled={user.id && !isCurrentUser} />
            </Field>
          </div>
        </div>
        {
          canManageUsers &&
            <div className="grid space--bottom-2">
              <div className="grid__item desk-6-12">
                <Field name="role" intlLabel="editor.role">
                  <SelectInput clearable={false} options={roleOptions} />
                </Field>
              </div>
            </div>
        }
        {
          isCurrentUser &&
            <Field
              name="password"
              intlLabel="editor.password"
              intlHint="editor.passwordHint"
            >
              <input type="password" autoComplete="off" />
            </Field>
        }
        <SubmitButton
          submitting={submitting}
          dirty={dirty}
          valid={valid}
          intlLabel="editor.button"
        />
      </Form>
    )
  }
}

UserForm.propTypes = {
  isCurrentUser: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  user: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  roles: PropTypes.array.isRequired,
  canManageUsers: PropTypes.bool,
}

const formConfig = {
  form: 'user',
}

function mapStateToProps(state, props) {
  const currentUser = getCurrentUser(state)
  const isCurrentUser = state.session.userType === 'user' && currentUser &&
    currentUser.id === props.user.id

  const role = getCurrentRole(state)
  const canManageUsers = role.attributes.can_manage_users

  const roles = Object.values(state.roles)

  const validations = {
    email: [validators.required(), validators.email()],
    first_name: [validators.required()],
    last_name: [validators.required()],
  }

  if (isCurrentUser) {
    validations.password = [validators.ifNotEmpty(validators.minLength(4))]
  }

  const initialValues = pick(
    props.user.attributes,
    ['first_name', 'last_name', 'email']
  )

  if (canManageUsers) {
    validations.role = [validators.required()]
    initialValues.role = props.user.relationships.role.data &&
      props.user.relationships.role.data.id
  }

  return {
    isCurrentUser,
    canManageUsers,
    enableReinitialize: true,
    validate: generateFormValidation(validations),
    initialValues,
    roles,
    onSubmit(value) {
      const newUser = deepClone(props.user)

      newUser.attributes = omit(value, ['role'])

      if (canManageUsers) {
        newUser.relationships.role.data = {
          id: value.role,
          type: 'role',
        }
      }

      return props.onSubmit(newUser)
    },
  }
}

export default connect(mapStateToProps)(reduxForm(formConfig)(UserForm))
