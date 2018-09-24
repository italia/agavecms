import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import { alert, notice } from 'actions/notifications'
import DeploymentForm from 'components/sub/DeploymentForm'
import convertToFormErrors from 'utils/convertToFormErrors'
import { update as updateEnvironment } from 'actions/environments'
import { deployment as instructions } from 'instructions'

import Instructions from 'components/sub/Instructions'

class EditDeploymentSettings extends Component {
  handleSubmit(environment) {
    const { dispatch } = this.props
    const { id, type, attributes } = environment

    return dispatch(updateEnvironment({ id, data: { id, type, attributes } }))
      .then(() => {
        dispatch(notice(this.t('admin.site.update.success')))
      })
      .catch((error) => {
        dispatch(alert(this.t('admin.site.update.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  render() {
    const { site, environments, params: { environmentId } } = this.props
    const { id, attributes } = environments[environmentId]
    const { name } = attributes

    return (
      <div className="Page">
        <div className="Page__inner">
          <div className="Page__header">
            <div className="Page__title">
              {name}
            </div>
          </div>
          <div className="Page__content--note">
            <Instructions value={instructions()} />
          </div>
          <div className="Page__content">
            <DeploymentForm
              site={site}
              environment={id}
              onSubmit={this.handleSubmit.bind(this)}
            />
          </div>
        </div>
      </div>
    )
  }
}

EditDeploymentSettings.propTypes = {
  dispatch: PropTypes.func.isRequired,
  site: PropTypes.object,
  params: PropTypes.object.isRequired,
  environments: PropTypes.object
}

function mapStateToProps(state) {
  const site = state.site
  const environments = state.environments

  return { site, environments }
}

export default connect(mapStateToProps)(EditDeploymentSettings)
