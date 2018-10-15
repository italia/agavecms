import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Component from 'components/BaseComponent';
import { Field, SubmitButton, Form } from 'components/form'
import { reduxForm } from 'redux-form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'

class SecureFtpWithIdentityFileSettings extends Component {
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
            name="domain"
            intlLabel="environment.deployAdapters.sftp.domain.label"
            intlHint="environment.deployAdapters.sftp.domain.hint"
          >
            <input type="text" className="form__input" />
          </Field>
          <Field
            name="remote_directory"
            intlLabel="environment.deployAdapters.sftp.remote_directory.label"
            intlHint="environment.deployAdapters.sftp.remote_directory.hint"
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
            name="identity"
            intlLabel="environment.deployAdapters.sftp.identity.label"
            intlHint="environment.deployAdapters.sftp.identity.hint"
          >
            <textarea ref="input" className="form__input" />
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

SecureFtpWithIdentityFileSettings.smallModal = true

const formConfig = {
  form: 'SecureFtpWithIdentityFileSettings'
}

SecureFtpWithIdentityFileSettings.propTypes = {
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
      domain: settings.domain,
      remote_directory: settings.remote_directory,
      user: settings.user,
      identity: settings.identity,
    },
    validate: generateFormValidation({
      domain: [validators.required()],
      remote_directory: [validators.required()],
      user: [validators.required()],
      identity: [validators.required()],
    }),
    onSubmit({ domain, remote_directory, user, identity }) {
      return props.onSubmit({
        domain,
        remote_directory,
        user,
        identity
      })
    }
  }
}


export default connect(mapStateToProps)(reduxForm(formConfig)(SecureFtpWithIdentityFileSettings))
