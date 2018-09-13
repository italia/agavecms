import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import { alert, notice } from 'actions/notifications'
import DeploymentForm from 'components/sub/DeploymentForm'
import convertToFormErrors from 'utils/convertToFormErrors'
import { update as updateSite } from 'actions/site'
import { deployment as instructions } from 'instructions'

import Instructions from 'components/sub/Instructions'

class EditDeploymentSettings extends Component {
  handleSubmit(site) {
    const { dispatch } = this.props

    return dispatch(updateSite({ data: site }))
      .then(() => {
        dispatch(notice(this.t('admin.site.update.success')))
      })
      .catch((error) => {
        dispatch(alert(this.t('admin.site.update.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  render() {
    const { site, params: { environment } } = this.props

    return (
      <div className="Page">
        <div className="Page__inner">
          <div className="Page__header">
            <div className="Page__title">
              {this.t(`deploymentEnvironments.${environment}`)}
            </div>
          </div>
          <div className="Page__content--note">
            <Instructions value={instructions()} />
          </div>
          <div className="Page__content">
            <DeploymentForm
              site={site}
              environment={environment}
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
}

function mapStateToProps(state) {
  const site = state.site
  return { site }
}

export default connect(mapStateToProps)(EditDeploymentSettings)
