import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { reduxForm } from 'redux-form'

import { resetPassword as requestPasswordReset } from 'actions/users'
import convertToFormErrors from 'utils/convertToFormErrors'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'

import { Field, SubmitButton, Form } from 'components/form'
import { alert, notice } from 'actions/notifications'
import Link from 'components/sub/Link'

class RequestPasswordReset extends Component {
  handleSubmit(values) {
    const { dispatch } = this.props

    const data = {
      type: 'user',
      attributes: {
        email: values.email,
      },
    }

    return dispatch(requestPasswordReset({ data }))
      .then(() => {
        dispatch(notice(this.t('noAuth.requestPasswordReset.create.success')))
        this.pushRoute('/')
      })
      .catch((error) => {
        dispatch(alert(this.t('noAuth.requestPasswordReset.create.failure')))
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
          {this.t('noAuth.requestPasswordReset.title')}
        </div>
        <div className="island__content">
          <Form
            error={error}
            onSubmit={handleSubmit(this.handleSubmit.bind(this))}
          >
            <Field name="email" intlLabel="signin.email">
              <input type="email" className="form__input--large" />
            </Field>
            <div className="or">
              <div className="or__item">
                <Link to="/">{this.t('noAuth.requestPasswordReset.goToSignIn')}</Link>
              </div>
              <div className="or__item">
                <SubmitButton
                  submitting={submitting}
                  dirty={dirty}
                  valid={valid}
                  intlLabel="requestPasswordReset.button"
                />
              </div>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}

RequestPasswordReset.propTypes = {
  dispatch: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
}

const formConfig = {
  form: 'requestPasswordReset',
  fields: ['email'],
  validate: generateFormValidation({
    email: [validators.required(), validators.email()],
  }),
}

export default reduxForm(formConfig)(RequestPasswordReset)
