import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { reduxForm } from 'redux-form'

import { create as createSession } from 'actions/session'
import convertToFormErrors from 'utils/convertToFormErrors'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'

import { Field, SubmitButton, Form } from 'components/form'
import { alert, notice } from 'actions/notifications'

class ResetPassword extends Component {
  handleSubmit(values) {
    const { dispatch, location } = this.props
    const { token } = location.query

    const data = {
      type: 'password_reset',
      attributes: {
        token,
        password: values.password,
      },
    }

    return dispatch(createSession({ data }))
      .then(() => {
        dispatch(notice(this.t('noAuth.resetPassword.create.success')))
        this.pushRoute('/editor')
      })
      .catch((error) => {
        dispatch(alert(this.t('noAuth.resetPassword.create.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  render() {
    const {
      error,
      valid,
      dirty,
      handleSubmit,
      submitting,
    } = this.props

    return (
      <div>
        <div className="island__title">
          {this.t('noAuth.resetPassword.title')}
        </div>
        <div className="island__content">
          <Form
            error={error}
            onSubmit={handleSubmit(this.handleSubmit.bind(this))}
          >
            <Field name="password" intlLabel="signin.password">
              <input type="password" className="form__input--large" />
            </Field>
            <SubmitButton
              submitting={submitting}
              dirty={dirty}
              valid={valid}
              intlLabel="resetPassword.button"
            />
          </Form>
        </div>
      </div>
    )
  }
}

ResetPassword.propTypes = {
  dispatch: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  location: PropTypes.object,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
}

const formConfig = {
  form: 'resetPassword',
  fields: ['password'],
  validate: generateFormValidation({
    password: [validators.required(), validators.minLength(4)],
  }),
}

export default reduxForm(formConfig)(ResetPassword)
