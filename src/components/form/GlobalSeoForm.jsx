import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { Field, SubmitButton, Form, ImageInput } from 'components/form'
import { reduxForm } from 'redux-form'
import validators from 'utils/validators'
import generateFormValidation from 'utils/generateFormValidation'
import { connect } from 'react-redux'

class GlobalSeoForm extends Component {
  render() {
    const {
      error,
      dirty,
      handleSubmit,
      submitting,
      valid,
    } = this.props

    return (
      <Form error={error} onSubmit={handleSubmit}>
        <Field required name="site_name" intlLabel="globalSeo.siteName">
          <input type="text" />
        </Field>
        <Field required name="fallback_seo.title" intlLabel="globalSeo.title">
          <input type="text" />
        </Field>
        <Field
          name="title_suffix"
          intlLabel="globalSeo.titleSuffix"
          placeholder=" - My website"
        >
          <input type="text" />
        </Field>
        <Field required name="fallback_seo.description" intlLabel="seo.description">
          <textarea />
        </Field>
        <Field name="fallback_seo.image" intlLabel="seo.image">
          <ImageInput editMetadata={false} />
        </Field>
        <Field name="twitter_account" intlLabel="globalSeo.twitterAccount">
          <input type="text" />
        </Field>
        <Field name="facebook_page_url" intlLabel="globalSeo.facebookPageUrl">
          <input type="text" />
        </Field>
        <SubmitButton
          valid={valid}
          dirty={dirty}
          submitting={submitting}
          intlLabel="globalSeo.button"
        />
      </Form>
    )
  }
}

const formConfig = {
  form: 'globalseo',
  enableReinitialize: true,
  validate: generateFormValidation({
    site_name: [validators.required()],
    title_suffix: [validators.maxLength(25)],
    facebook_page_url: [validators.url()],
    fallback_seo: {
      title: [validators.required(), validators.maxLength(55)],
      description: [validators.required(), validators.maxLength(160)],
      image: [validators.minImageWidth(200), validators.minImageHeight(200)],
    },
  }),
}

GlobalSeoForm.propTypes = {
  globalSeo: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
}

function mapStateToProps(state, props) {
  return {
    initialValues: props.globalSeo,
    onSubmit(values) {
      Object.assign(values.fallback_seo, { image: values.fallback_seo.image || null })
      return props.onSubmit(values)
    },
  }
}

export default connect(mapStateToProps)(reduxForm(formConfig)(GlobalSeoForm))
