import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import DeploymentForm from 'components/sub/DeploymentForm'
import convertToFormErrors from 'utils/convertToFormErrors'
import {
  destroy as destroyEnvironment,
  update as updateEnvironment
} from 'actions/environments'
import Instructions from 'components/sub/Instructions'
import { deployment as instructions } from 'instructions'
import { FormattedMessage } from 'react-intl'
import { alert, notice } from 'actions/notifications'

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

  handleDestroy(e) {
    const { dispatch, environment } = this.props

    e.preventDefault()

    if (!confirm(this.t('messages.areyousure'))) {
      return
    }

    dispatch(destroyEnvironment({ id: environment.id }))
      .then(() => {
        dispatch(notice(this.t('admin.itemType.destroy.success')))
        this.pushRoute('/admin/deployment')
      })
      .catch(() => {
        dispatch(alert(this.t('admin.itemType.destroy.failure')))
      })
  }

  render() {
    const { site, environment } = this.props

    if (!environment) {
      return null
    }

    const { id, attributes } = environment
    const { name } = attributes

    return (
      <div className="Page">
        <div className="Page__inner">
          <div className="Page__header">
            <div className="Page__title">
              {name}
            </div>
            <div className="Page__space" />
            <a
              href="#"
              onClick={this.handleDestroy.bind(this)}
              className="Page__action--delete"
            >
              <i className="icon--delete" />
              <span><FormattedMessage id="itemType.row.delete" /></span>
            </a>
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
  environments: PropTypes.object,
  environment: PropTypes.object
}

function mapStateToProps(state, props) {
  const { site, environments } = state
  const environment = environments[props.params.environmentId]

  return { site, environments, environment }
}

export default connect(mapStateToProps)(EditDeploymentSettings)
