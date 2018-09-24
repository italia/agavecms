import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { reduxForm, change } from 'redux-form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'
import apifyLabel from 'utils/apifyLabel'
import { Field, SubmitButton, Form } from 'components/form'
import deepClone from 'deep-clone'
import { connect } from 'react-redux'
import pick from 'object.pick'

class EnvironmentForm extends Component {
  render() {
    const {
      error,
      valid,
      dirty,
      submitting,
      dispatch,
      isNewEnvironment,
      handleSubmit,
    } = this.props

    return (
      <Form error={error} onSubmit={handleSubmit}>
        <Field
          name="name"
          intlLabel="environment.name"
          intlPlaceholder="environment.name.placeholder"
          intlHint="environment.name.hint"
          wrapInput={
            (input) => {
              return Object.assign({}, input, {
                onChange(e) {
                  const result = input.onChange(e)
                  if (isNewEnvironment) {
                    dispatch(change('environment', 'api_key', apifyLabel(e.target.value)))
                  }
                  return result
                },
              })
            }
          }
        >
          <input type="text" className="form__input--large" autoFocus />
        </Field>
        <Field
          name="git_repo_url"
          intlLabel="environment.git_repo_url"
          intlPlaceholder="environment.git_repo_url.placeholder"
          intlHint="environment.git_repo_url.hint"
        >
          <input type="text" className="form__input--code" />
        </Field>
        <Field
          name="frontend_url"
          intlLabel="environment.frontend_url"
          intlPlaceholder="environment.frontend_url.placeholder"
          intlHint="environment.frontend_url.hint"
        >
          <input type="text" className="form__input--code" />
        </Field>
        <SubmitButton
          submitting={submitting}
          dirty={dirty}
          valid={valid}
          intlLabel="environment.button"
        />
      </Form>
    )
  }
}

EnvironmentForm.propTypes = {
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  environment: PropTypes.object.isRequired,
  isNewEnvironment: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
}

const formConfig = {
  form: 'environment',
  validate: generateFormValidation({
    name: [validators.required()],
  }),
}

function mapStateToProps(state, props) {
  const initialValues = pick(props.environment.attributes, ['name', 'git_repo_url', 'frontend_url'])

  return {
    initialValues,
    isNewEnvironment: !props.environment.id,
    onSubmit(value) {
      const newEnvironment = deepClone(props.environment)

      newEnvironment.attributes = pick(value, ['name', 'git_repo_url', 'frontend_url'])

      return props.onSubmit(newEnvironment)
    },
  }
}

export default connect(mapStateToProps)(reduxForm(formConfig)(EnvironmentForm))
