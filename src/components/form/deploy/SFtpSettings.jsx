import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Component from 'components/BaseComponent';
import { Field, SubmitButton, Form } from 'components/form'
import { reduxForm } from 'redux-form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'

class SFtpSettings extends Component {
  render() {
    const {
      error,
      submitting,
      handleSubmit,
      dirty,
      valid
    } = this.props

    return (
      <div className="SFtpSettings">
        <Form error={error} onSubmit={handleSubmit}>
          <Field
            name="url"
            intlLabel="environment.deployAdapters.sftp.url.label"
            intlHint="environment.deployAdapters.sftp.url.hint"
          >
            <input type="text" className="form__input" />
          </Field>
          <Field
            name="user"
            intlLabel="environment.deployAdapters.sftp.user.label"
            intlHint="environment.deployAdapters.sftp.user.hint"
          >
            <input type="text" className="form__input" />
          </Field>
          <Field
            name="password"
            intlLabel="environment.deployAdapters.sftp.password.label"
            intlHint="environment.deployAdapters.sftp.password.hint"
          >
            <input type="password" className="form__input" />
          </Field>
          <SubmitButton
            submitting={submitting}
            dirty={dirty}
            valid={valid}
            intlLabel="environment.deployAdapters.sftp.button"
          />
        </Form>
      </div>
    )
  }
}

SFtpSettings.smallModal = true

const formConfig = {
  form: 'SFtpSettings'
}

SFtpSettings.propTypes = {
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  settings: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(state, props) {
  const settings = props.settings || {};

  return {
    initialValues: {
      url: settings.url,
      user: settings.user,
      password: settings.password,
    },
    validate: generateFormValidation({
      url: [validators.required()],
      user: [validators.required()],
      password: [validators.required()],
    }),
    onSubmit({ url, user, password }) {
      return props.onSubmit({
        url,
        user,
        password
      })
    }
  }
}


export default connect(mapStateToProps)(reduxForm(formConfig)(SFtpSettings))
