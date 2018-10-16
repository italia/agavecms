import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import { deploy } from 'actions/site'
import { fetchAll as fetchEnvironments } from 'actions/environments'
import { getCurrentRole } from 'utils/storeQueries'
import { FormattedMessage } from 'react-intl'
import enhanceWithClickOutside from 'react-click-outside'
import Link from 'components/sub/Link'
import _ from 'lodash'

class StatusPane extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      upload: false,
      pendingElements: [],
    }
    this.pendings = {}
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchEnvironments())
  }

  handlePublish(env, e) {
    e.preventDefault()

    this.setState({
      upload: true,
      pendingElements: this.state.pendingElements.concat(env.id)
    })

    this.props.dispatch(deploy({ data: env }))
      .then(() => {
        return this.startPolling(env)
      })
  }

  startPolling(env) {
    if (this.pendings[env.id] !== undefined) {
      return
    }

    this.pendings[env.id] = setInterval(() => {
      this.checkStatus()
        .then(() => {
          this.removeCompletedElement()

          if (!this.hasPendingElements()) {
            this.stopPolling()
          }
        })
    }, 10000)
  }

  checkStatus() {
    return this.props.dispatch(fetchEnvironments())
  }

  stopPolling() {
    Object.values(this.pendings).forEach((el) => {
      clearInterval(el)
    })
    this.setState({ pendingElements: [] })
  }

  hasPendingElements() {
    return this.props.environments.some((el) => {
      return el.attributes.deploy_status === 'pending'
    })
  }

  removeCompletedElement() {
    this.setState({
      pendingElements: _.difference(
        this.filterPendingElements(),
        this.filterCompletedElements()
      )
    })
  }

  filterPendingElements() {
    return this.props.environments.filter((el) => {
      return el.attributes.deploy_status === 'pending'
    }).map((el) => el.id)
  }

  filterCompletedElements() {
    return this.props.environments.filter((el) => {
      return el.attributes.deploy_status !== 'pending'
    }).map((el) => el.id)
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
          {env.attributes.name}
        </div>
        <div className="StatusPane__environment__status">
          {this.t('deploymentEnvironments.status.toConfigure')}
          {
            canEditSite &&
              <Link
                to={`/admin/deployment/${env.id}`}
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
    const canPublish = this.props.permissions.production

    return (
      <div className="StatusPane__environment">
        <div className="StatusPane__environment__name">
          <div className="StatusPane__environment__status-icon red" />
          {env.attributes.name}
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
    const canPublish = this.props.permissions.production

    return (
      <div className="StatusPane__environment">
        <div className="StatusPane__environment__name">
          <div className="StatusPane__environment__status-icon yellow" />
          {env.attributes.name}
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
    this.startPolling(env)

    return (
      <div className="StatusPane__environment">
        <div className="StatusPane__environment__name">
          <div className="StatusPane__environment__status-icon pending" />
          {env.attributes.name}
        </div>
        <div className="StatusPane__environment__status">
          <FormattedMessage id="deploymentEnvironments.status.pending" />
        </div>
      </div>
    )
  }

  renderNeverDeployedEnv(env) {
    const canPublish = this.props.permissions.production

    return (
      <div className="StatusPane__environment">
        <div className="StatusPane__environment__name">
          <div className="StatusPane__environment__status-icon" />
          {env.attributes.name}
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
    const canPublish = this.props.permissions.production

    return (
      <div className="StatusPane__environment">
        <div className="StatusPane__environment__name">
          <div className="StatusPane__environment__status-icon green" />
          {env.attributes.name}
        </div>
        <div className="StatusPane__environment__status">
          <FormattedMessage id="deploymentEnvironments.status.clean" />
          {
            canPublish &&
              <a
                href="#"
                onClick={this.handlePublish.bind(this, env)}
                className="button button--primary button--tiny"
              >
                <i className="icon--upload" />
                <span>{this.t('deployPanel.update.button')}</span>
              </a>
          }
        </div>
      </div>
    )
  }

  renderEnv(env) {
    const deployGitRepoUrl = env.attributes.git_repo_url
    const deployStatus = env.attributes.deploy_status
    const deployAdapter = env.attributes.deploy_adapter

    const calculateStatus = () => {
      if (!deployGitRepoUrl || !deployAdapter) {
        return 'to-configure'
      }

      if (this.state.pendingElements.includes(env.id)) {
        return 'pending'
      }

      if (deployStatus === null) {
        return 'never-deployed'
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
    const { environments } = this.props

    return (
      <div className="StatusPane">
        <a href="#" className="StatusPane__handle" onClick={this.handleToggle.bind(this)}>
          Status
          <i className={this.state.isOpen ? 'icon--chevron-up' : 'icon--chevron-down'} />
        </a>
        {
          this.state.isOpen &&
            <div className="StatusPane__dropdown">
              { environments.map(this.renderEnv.bind(this)) }
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
  environments: PropTypes.array,
}

function mapStateToProps(state) {
  const role = getCurrentRole(state)
  const environments = Object.values(state.environments)

  return {
    site: state.site,
    environments,
    canEditSite: role && role.attributes.can_edit_site,
    permissions: {
      production: role && role.attributes.can_publish_to_production,
    },
  }
}

export default connect(mapStateToProps)(enhanceWithClickOutside(StatusPane))
