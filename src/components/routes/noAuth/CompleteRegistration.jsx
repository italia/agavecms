import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { reduxForm } from 'redux-form'

import { create as createSession } from 'actions/session'
import convertToFormErrors from 'utils/convertToFormErrors'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'
import config from 'config'

import { Field, SubmitButton, Form } from 'components/form'
import { alert, notice } from 'actions/notifications'

class CompleteRegistration extends Component {
  handleSubmit(values) {
    const { dispatch, location } = this.props
    const { token } = location.query

    const data = {
      type: 'invitation',
      attributes: {
        token,
        password: values.password,
        check_policy: values.check_policy,
      },
    }

    return dispatch(createSession({ data }))
      .then(() => {
        dispatch(notice(this.t('noAuth.completeRegistration.create.success')))
        this.pushRoute('/editor')
      })
      .catch((error) => {
        dispatch(alert(this.t('noAuth.completeRegistration.create.failure')))
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

    const cookiePolicyId = config.iubendaCookiePolicyId
    const labelPolicy = `Hai letto e acconsentito la <a href="https://www.iubenda.com/privacy-policy/${cookiePolicyId}/cookie-policy" target="_blank">cookie</a> e la <a href="https://www.iubenda.com/privacy-policy/${cookiePolicyId}" target="_blank">privacy</a> policy?`

    return (
      <div>
        <div className="island__title">
          {this.t('noAuth.completeRegistration.title')}
        </div>
        <div className="island__content">
          <Form
            error={error}
            onSubmit={handleSubmit(this.handleSubmit.bind(this))}
          >
            <Field name="password" intlLabel="signin.password">
              <input type="password" className="form__input--large" />
            </Field>
            <Field name="check_policy" intlLabel={labelPolicy}>
              <input type="checkbox" className="form__input--large" />
            </Field>
            <SubmitButton
              submitting={submitting}
              dirty={dirty}
              valid={valid}
              intlLabel="completeRegistration.button"
            />
          </Form>
        </div>
      </div>
    )
  }
}

CompleteRegistration.propTypes = {
  dispatch: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  location: PropTypes.object,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
}

const formConfig = {
  form: 'completeRegistration',
  fields: ['password', 'check_policy'],
  validate: generateFormValidation({
    password: [validators.required(), validators.minLength(4)],
    check_policy: [validators.required()]
  }),
}

export default reduxForm(formConfig)(CompleteRegistration)
