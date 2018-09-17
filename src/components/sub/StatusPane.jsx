import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import { deploy } from 'actions/site'
import { getCurrentRole } from 'utils/storeQueries'
import { FormattedMessage } from 'react-intl'
import enhanceWithClickOutside from 'react-click-outside'
import Link from 'components/sub/Link'

class StatusPane extends Component {
  constructor(props) {
    super(props)
    this.state = { isOpen: false }
  }

  handlePublish(env, e) {
    e.preventDefault()
    this.props.dispatch(deploy({ environment: env }))
  }

  handleToggle(e) {
    e.preventDefault()
    this.setState({ isOpen: !this.state.isOpen })
  }

  handleClickOutside() {
    this.setState({ isOpen: false })
  }

  renderToConfigureEnv(env) {
    const { canEditSite } = this.props

    return (
      <div className="StatusPane__environment">
        <div className="StatusPane__environment__name">
          <div className="StatusPane__environment__status-icon" />
          {this.t(`deploymentEnvironments.${env}`)}
        </div>
        <div className="StatusPane__environment__status">
          {this.t('deploymentEnvironments.status.toConfigure')}
          {
            canEditSite &&
              <Link
                to={`/admin/deployment/${env}`}
                className="button button--primary button--tiny"
              >
                {this.t('deployPanel.toConfigure.button')}
              </Link>
          }
        </div>
      </div>
    )
  }

  renderFailEnv(env) {
    const canPublish = this.props.permissions[env]

    return (
      <div className="StatusPane__environment">
        <div className="StatusPane__environment__name">
          <div className="StatusPane__environment__status-icon red" />
          {this.t(`deploymentEnvironments.${env}`)}
        </div>
        <div className="StatusPane__environment__status">
          {this.t('deploymentEnvironments.status.fail')}
          {
            canPublish &&
              <a
                href="#"
                onClick={this.handlePublish.bind(this, env)}
                className="button button--primary button--tiny"
              >
                <i className="icon--upload" />
                <span>{this.t('deployPanel.failure.button')}</span>
              </a>
          }
        </div>
      </div>
    )
  }

  renderTouchedEnv(env) {
    const canPublish = this.props.permissions[env]

    return (
      <div className="StatusPane__environment">
        <div className="StatusPane__environment__name">
          <div className="StatusPane__environment__status-icon yellow" />
          {this.t(`deploymentEnvironments.${env}`)}
        </div>
        <div className="StatusPane__environment__status">
          {
            canPublish &&
              <a
                href="#"
                onClick={this.handlePublish.bind(this, env)}
                className="button button--primary button--tiny"
              >
                <i className="icon--upload" />
                <span>{this.t('deployPanel.touched.button')}</span>
              </a>
          }
        </div>
      </div>
    )
  }

  renderPendingEnv(env) {
    return (
      <div className="StatusPane__environment">
        <div className="StatusPane__environment__name">
          <div className="StatusPane__environment__status-icon pending" />
          {this.t(`deploymentEnvironments.${env}`)}
        </div>
        <div className="StatusPane__environment__status">
          <FormattedMessage id="deploymentEnvironments.status.pending" />
        </div>
      </div>
    )
  }

  renderNeverDeployedEnv(env) {
    const canPublish = this.props.permissions[env]

    return (
      <div className="StatusPane__environment">
        <div className="StatusPane__environment__name">
          <div className="StatusPane__environment__status-icon" />
          {this.t(`deploymentEnvironments.${env}`)}
        </div>
        <div className="StatusPane__environment__status">
          <FormattedMessage id="deploymentEnvironments.status.neverDeployed" />
          {
            canPublish &&
              <a
                href="#"
                onClick={this.handlePublish.bind(this, env)}
                className="button button--primary button--tiny"
              >
                <i className="icon--upload" />
                <span>{this.t('deployPanel.neverDeployed.button')}</span>
              </a>
          }
        </div>
      </div>
    )
  }

  renderCleanEnv(env) {
    return (
      <div className="StatusPane__environment">
        <div className="StatusPane__environment__name">
          <div className="StatusPane__environment__status-icon green" />
          {this.t(`deploymentEnvironments.${env}`)}
        </div>
      </div>
    )
  }

  renderEnv(env) {
    const { site } = this.props

    const deployGitRepoUrl = site.attributes.git_repo_url
    const deployStatus = site.attributes[`${env}_deploy_status`]

    const calculateStatus = () => {
      if (!deployGitRepoUrl) {
        return 'to-configure'
      }

      if (deployStatus === 'unstarted') {
        return 'never-deployed'
      }

      if (deployStatus === 'pending') {
        return 'pending'
      }

      if (deployStatus === 'fail') {
        return 'fail'
      }

      return 'clean'
    }

    switch (calculateStatus()) {
      case 'clean':
        return this.renderCleanEnv(env)
      case 'touched':
        return this.renderTouchedEnv(env)
      case 'pending':
        return this.renderPendingEnv(env)
      case 'never-deployed':
        return this.renderNeverDeployedEnv(env)
      case 'fail':
        return this.renderFailEnv(env)
      case 'to-configure':
        return this.renderToConfigureEnv(env)
      default:
        return null
    }
  }

  render() {
    return (
      <div className="StatusPane">
        <a href="#" className="StatusPane__handle" onClick={this.handleToggle.bind(this)}>
          Status
          <i className={this.state.isOpen ? 'icon--chevron-up' : 'icon--chevron-down'} />
        </a>
        {
          this.state.isOpen &&
            <div className="StatusPane__dropdown">
              {['production'].map(this.renderEnv.bind(this))}
            </div>
        }
      </div>
    )
  }
}

StatusPane.propTypes = {
  site: PropTypes.object.isRequired,
  permissions: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  canEditSite: PropTypes.bool,
}

function mapStateToProps(state) {
  const role = getCurrentRole(state)

  return {
    site: state.site,
    canEditSite: role && role.attributes.can_edit_site,
    permissions: {
      production: role && role.attributes.can_publish_to_production,
    },
  }
}

export default connect(mapStateToProps)(enhanceWithClickOutside(StatusPane))
