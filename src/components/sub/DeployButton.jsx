import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import { deploy, fetch as getSite } from 'actions/site'
import Spinner from 'components/sub/Spinner'
import { getCurrentRole } from 'utils/storeQueries'

const env = 'production'

class DeployButton extends Component {
  constructor(props) {
    super(props)
    this.state = { isOpen: false, loading: false }
    this.interval = null;
  }

  handlePublish(e) {
    e.preventDefault()
    this.setState({ loading: true })
    this.props.dispatch(deploy({ environment: env }))
    .then(() => {
      return this.checkStatus()
    })
    .then(() => {
      return this.startPolling()
    })
  }

  isPending() {
    return this.props.site.attributes[`${env}_deploy_status`] === 'pending'
  }

  checkStatus() {
    const { loading } = this.state
    if (loading && this.isPending()) {
      this.setState({ loading: false })
    }
    if (!loading && !this.isPending()) {
      return this.stopPolling()
    }
    const include = ['item_types', 'item_types.singleton_item'].join(',')
    return this.props.dispatch(getSite({ force: true, query: { include } }))
  }

  stopPolling() {
    if (this.interval) clearInterval(this.interval)
  }

  startPolling() {
    this.interval = setInterval(() => {
      this.checkStatus()
    }, 5000)
  }

  renderLoading() {
    return (
      <span className="DeployButton DeployButton--reverse">
        <div className="DeployButton__progress" />
        <Spinner inline reverse size={25} />
        <span>{this.t('deployPanel.pending.label')}</span>
      </span>
    )
  }

  renderDeploy() {
    const hasPermission = this.props.permissions[env]

    return (
      hasPermission ?
        <a
          href="#"
          className="DeployButton DeployButton--reverse"
          onClick={this.handlePublish.bind(this)}
        >
          <i className="icon--upload" />
          <span>{this.t('deployPanel.touched.label')}</span>
        </a>
        :
        null
    )
  }

  render() {
    const { site } = this.props
    const { loading } = this.state
    const calculateStatus = () => {
      const deployGitRepoUrl = site.attributes.git_repo_url
      const deployStatus = site.attributes[`${env}_deploy_status`]

      if (!deployGitRepoUrl) {
        return 'to-configure'
      }

      if (deployStatus === 'unstarted') {
        return 'never-deployed'
      }

      if (loading || deployStatus === 'pending') {
        return 'pending'
      }

      if (deployStatus === 'fail') {
        return 'fail'
      }

      if (deployStatus === 'success') {
        return 'success'
      }

      return 'clean'
    }

    switch (calculateStatus()) {
      case 'never-deployed':
        return this.renderDeploy()
      case 'touched':
        return this.renderDeploy()
      case 'fail':
        return this.renderDeploy()
      case 'success':
        return this.renderDeploy()
      case 'pending':
        return this.renderLoading()
      default:
        return null
    }
  }
}

DeployButton.propTypes = {
  site: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  permissions: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  const role = getCurrentRole(state)

  return {
    site: state.site,
    permissions: {
      production: role && role.attributes.can_publish_to_production,
    },
  }
}

export default connect(mapStateToProps)(DeployButton);
