import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import DeployEvent from 'components/sub/DeployEvent'
import Spinner from 'components/sub/Spinner'
import { FormattedMessage } from 'react-intl'
import { logs as instructions } from 'instructions'
import { fetchAll as getDeployEvents } from 'actions/deployEvents'
import { abortDeploy } from 'actions/site'
import Instructions from 'components/sub/Instructions'

class EditDeploymentSettings extends Component {
  componentDidMount() {
    this.props.dispatch(getDeployEvents())
  }

  handleFailClick(env, e) {
    e.preventDefault()
    this.props.dispatch(abortDeploy({ environment: env }))
  }

  renderEvent(event) {
    return <DeployEvent key={event.id} event={event} />
  }

  renderStatus(env) {
    const { attributes } = this.props.site

    if (attributes[`${env}_deploy_status`] === 'pending') {
      return (
        <div className="DeployEvent">
          <div className="DeployEvent__inner">
            <div className="DeployEvent__title">
              <div className="DeployEvent__environment">
                {this.t(`deploymentEnvironments.${env}`)}
              </div>
              <span>{this.t('deployEvent.type.in_progress')}</span>
              <Spinner inline size={24} />
            </div>
            <div className="DeployEvent__sub">
              <div className="DeployEvent__sub__item">
                <a
                  href="#"
                  onClick={this.handleFailClick.bind(this, env)}
                >
                  {this.t('admin.deploymentLogs.abort')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return undefined
  }

  render() {
    const { events } = this.props

    return (
      <div className="Page">
        <div className="Page__inner">
          <div className="Page__header">
            <div className="Page__title">
              <FormattedMessage id="admin.deploymentLogs.title" />
            </div>
          </div>
          <div className="Page__content--note">
            <Instructions value={instructions()} />
          </div>
          <div className="Page__content--transparent">
            {this.renderStatus('production')}
            {events.map(this.renderEvent, this)}
            {
              events.length === 0 &&
                <div className="blank-slate blank-slate--tiny">
                  <p className="blank-slate__title">
                    {this.t('admin.deploymentLogs.noEvents.title')}
                  </p>
                  <p className="blank-slate__description">
                    {this.t('admin.deploymentLogs.noEvents.description')}
                  </p>
                </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

EditDeploymentSettings.propTypes = {
  dispatch: PropTypes.func.isRequired,
  events: PropTypes.array,
  site: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  const events = Object.values(state.deployEvents)
    .sort((a, b) => Date.parse(a.attributes.created_at) - Date.parse(b.attributes.created_at))
    .reverse()

  const site = state.site

  return { events, site }
}

export default connect(mapStateToProps)(EditDeploymentSettings)

