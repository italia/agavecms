import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import Component from 'components/BaseComponent'
import { create as createSession } from 'actions/session'
import convertToFormErrors from 'utils/convertToFormErrors'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'
import config from 'config'

import { Field, SubmitButton, Form } from 'components/form'
import { alert, notice } from 'actions/notifications'
import Link from 'components/sub/Link'

class SignIn extends Component {
  handleSubmit(values) {
    const { dispatch } = this.props

    const data = {
      type: 'email_credentials',
      attributes: values,
    }

    return dispatch(createSession({ data }))
      .then(() => {
        dispatch(notice(this.t('noAuth.signIn.create.success')))
        this.pushRoute('/editor')
      })
      .catch((error) => {
        dispatch(alert(this.t('noAuth.signIn.create.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  renderForm() {
    const {
      error,
      valid,
      handleSubmit,
      dirty,
      submitting,
    } = this.props

    const cookiePolicyId = config.iubendaCookiePolicyId

    return (
      <Form
        error={error}
        onSubmit={handleSubmit(this.handleSubmit.bind(this))}
      >
        <Field name="email" intlLabel="signin.email">
          <input type="email" className="form__input--large" />
        </Field>
        <Field name="password" intlLabel="signin.password">
          <input type="password" className="form__input--large" />
        </Field>
        <div>
          <span>
            Hai letto e acconsentito la&nbsp;
            <a
              href={`https://www.iubenda.com/privacy-policy/${cookiePolicyId}/cookie-policy`}
              target="_blank"
              rel="noopener noreferrer"
            >
              cookie
            </a>
            &nbsp;e la&nbsp;
            <a
              href={`https://www.iubenda.com/privacy-policy/${cookiePolicyId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              privacy
            </a> policy?
          </span>
        </div>
        <div className="or space--top-2">
          <div className="or__item">
            <Link to="/request_password_reset">
              {this.t('noAuth.signIn.gotoRequestPasswordReset')}
            </Link>
          </div>
          <div className="or__item">
            <SubmitButton
              primary
              submitting={submitting}
              dirty={dirty}
              valid={valid}
              intlLabel="signin.button"
            />
          </div>
        </div>
      </Form>
    )
  }

  render() {
    return (
      <div>
        <div className="island__title">
          { this.t('noAuth.signIn.title') }
        </div>
        <div className="island__content">
          { this.renderForm() }
        </div>
      </div>
    )
  }
}

SignIn.propTypes = {
  dispatch: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
}

const formConfig = {
  form: 'signin',
  validate: generateFormValidation({
    email: [validators.required(), validators.email()],
    password: [validators.required(), validators.minLength(4)]
  })
};

export default connect(() => ({}))(reduxForm(formConfig)(SignIn))
