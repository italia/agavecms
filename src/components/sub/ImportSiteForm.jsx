import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { reduxForm } from 'redux-form'
import {
  Field,
  SubmitButton,
  Form,
  FileInputBase
} from 'components/form'
import { connect } from 'react-redux'

class ImportSiteForm extends Component {
  render() {
    const {
      error,
      submitting,
      handleSubmit,
      dirty,
      valid,
    } = this.props

    return (
      <div>
        <Form error={error} onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="space--bottom-5">
            <Field
              name="json_url"
              intlLabel="import_site.jsonUrl.label"
              intlHint="import_site.jsonUrl.hint"
            >
              <input type="text" className="form__input" />
            </Field>
            <Field name="file" intlLabel="import_site.fileSite.label">
              <FileInputBase />
            </Field>
          </div>
          <SubmitButton
            submitting={submitting}
            dirty={dirty}
            disabled={submitting}
            valid={valid}
            intlLabel="import_site.button"
          />
        </Form>
      </div>
    )
  }
}

ImportSiteForm.propTypes = {
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired
}

ImportSiteForm.contextTypes = Object.assign(
  { route: React.PropTypes.object },
  Component.contextTypes
)

const formConfig = { form: 'importJson' }

function mapStateToProps(state, props) {
  return {
    onSubmit(value) {
      return props.onSubmit(value)
    }
  }
}

export default connect(mapStateToProps)(reduxForm(formConfig)(ImportSiteForm))
