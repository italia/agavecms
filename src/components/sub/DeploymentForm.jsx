import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { reduxForm } from 'redux-form'
import { Field, SubmitButton, Form } from 'components/form'
import deepClone from 'deep-clone'
import { connect } from 'react-redux'

class DeploymentForm extends Component {
  componentDidMount() {
    this.removeRouteLeaveHook = this.context.router.setRouteLeaveHook(
      this.context.route,
      this.routerWillLeave.bind(this)
    )
  }

  componentWillUnmount() {
    this.removeRouteLeaveHook()
  }

  routerWillLeave() {
    if (this.props.dirty) {
      return this.t('messages.notsaved')
    }

    return null
  }

  render() {
    const {
      error,
      submitting,
      handleSubmit,
      dirty,
      valid
    } = this.props

    return (
      <div>
        <Form error={error} onSubmit={handleSubmit}>
          <Field
            name="git_repo_url"
            intlLabel="site.gitRepoUrl.label"
            intlHint="site.gitRepoUrl.hint"
          >
            <input type="text" className="form__input" />
          </Field>
          <Field
            name="frontend_url"
            intlLabel="site.frontendUrl.label"
            intlHint="site.frontendUrl.hint"
          >
            <input type="text" className="form__input" />
          </Field>
          <SubmitButton
            submitting={submitting}
            dirty={dirty}
            valid={valid}
            intlLabel="site.button"
          />
        </Form>
      </div>
    )
  }
}

DeploymentForm.propTypes = {
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  site: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  environment: PropTypes.string.isRequired,
  valid: PropTypes.bool.isRequired
}

DeploymentForm.contextTypes = Object.assign(
  { route: React.PropTypes.object },
  Component.contextTypes
)

const formConfig = {
  form: 'environment',
  fields: ['deploy']
}

function mapStateToProps(state, props) {
  const environment = state.environments[props.environment]
  const { attributes } = environment

  const initialValues = {
    name: attributes.name,
    git_repo_url: attributes.git_repo_url,
    frontend_url: attributes.frontend_url,
  }

  return {
    initialValues,
    enableReinitialize: true,
    onSubmit(value) {
      const newEnvironment = deepClone(environment)

      newEnvironment.attributes = {
        name: attributes.name,
        git_repo_url: value.git_repo_url,
        frontend_url: value.frontend_url,
      }

      return props.onSubmit(newEnvironment)
    }
  }
}

export default connect(mapStateToProps)(reduxForm(formConfig)(DeploymentForm))
