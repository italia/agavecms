import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { Field, SubmitButton, Form, ImageInput } from 'components/form'
import { reduxForm } from 'redux-form'
import validators from 'utils/validators'
import generateFormValidation from 'utils/generateFormValidation'
import { connect } from 'react-redux'

class SeoForm extends Component {
  render() {
    const {
      error,
      dirty,
      valid,
      handleSubmit,
      submitting,
    } = this.props

    return (
      <Form error={error} onSubmit={handleSubmit}>
        <Field required name="title" intlLabel="seo.title">
          <input type="text" />
        </Field>
        <Field required name="description" intlLabel="seo.description">
          <textarea />
        </Field>
        <Field name="image" intlLabel="seo.image">
          <ImageInput />
        </Field>
        <SubmitButton
          submitting={submitting}
          dirty={dirty}
          valid={valid}
          intlLabel="seo.button"
        />
      </Form>
    )
  }
}

SeoForm.propTypes = {
  seo: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
}

const formConfig = {
  form: 'seoinput',
  validate: generateFormValidation({
    title: [validators.required(), validators.maxLength(65)],
    description: [validators.required(), validators.maxLength(160)],
    image: [validators.minImageWidth(200), validators.minImageHeight(200)],
  }),
}

function mapStateToProps(state, props) {
  return {
    initialValues: props.seo || {
      title: null,
      description: null,
      image: null,
    },
    onSubmit(values) {
      return props.onSubmit(values)
    },
  }
}

export default connect(mapStateToProps)(reduxForm(formConfig)(SeoForm))
