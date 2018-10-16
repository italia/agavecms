import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Component from 'components/BaseComponent';
import { Field, SubmitButton, Form } from 'components/form'
import { reduxForm } from 'redux-form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'

class FtpSettings extends Component {
  render() {
    const {
      error,
      submitting,
      handleSubmit,
      dirty,
      valid
    } = this.props

    return (
      <div className="FtpSettings">
        <Form error={error} onSubmit={handleSubmit}>
          <Field
            name="domain"
            intlLabel="environment.deployAdapters.ftp.domain.label"
            intlHint="environment.deployAdapters.ftp.domain.hint"
          >
            <input type="text" className="form__input" />
          </Field>
          <Field
            name="remote_directory"
            intlLabel="environment.deployAdapters.ftp.remote_directory.label"
            intlHint="environment.deployAdapters.ftp.remote_directory.hint"
          >
            <input type="text" className="form__input" />
          </Field>
          <Field
            name="user"
            intlLabel="environment.deployAdapters.ftp.user.label"
            intlHint="environment.deployAdapters.ftp.user.hint"
          >
            <input type="text" className="form__input" />
          </Field>
          <Field
            name="password"
            intlLabel="environment.deployAdapters.ftp.password.label"
            intlHint="environment.deployAdapters.ftp.password.hint"
          >
            <input type="password" className="form__input" />
          </Field>
          <SubmitButton
            submitting={submitting}
            dirty={dirty}
            valid={valid}
            intlLabel="environment.deployAdapters.ftp.button"
          />
        </Form>
      </div>
    )
  }
}

FtpSettings.smallModal = true

const formConfig = {
  form: 'FtpSettings'
}

FtpSettings.propTypes = {
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
      password: settings.password,
    },
    validate: generateFormValidation({
      domain: [validators.required()],
      remote_directory: [validators.required()],
      user: [validators.required()],
      password: [validators.required()],
    }),
    onSubmit({ domain, remote_directory, user, password }) {
      return props.onSubmit({
        domain,
        remote_directory,
        user,
        password
      })
    }
  }
}


export default connect(mapStateToProps)(reduxForm(formConfig)(FtpSettings))
