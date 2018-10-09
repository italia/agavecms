import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Component from 'components/BaseComponent';
import { SubmitButton, Form } from 'components/form'
import { reduxForm } from 'redux-form'
import Instructions from 'components/sub/Instructions'

class LocalServerSettings extends Component {
  render() {
    const {
      error,
      submitting,
      handleSubmit,
      valid
    } = this.props

    const dirty = true

    return (
      <div className="LocalServerSettings">
        <Form error={error} onSubmit={handleSubmit}>
          <div className="Page__content--note">
            <Instructions value={this.t('environment.deployAdapters.local_server.instruction')} />
          </div>
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

LocalServerSettings.smallModal = true

const formConfig = {
  form: 'LocalServerSettings'
}

LocalServerSettings.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  error: PropTypes.string,
  settings: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(state, props) {
  return {
    onSubmit() {
      return props.onSubmit({
      })
    }
  }
}

export default connect(mapStateToProps)(reduxForm(formConfig)(LocalServerSettings))
