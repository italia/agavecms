import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import Link from 'components/sub/Link'
import SplitPane from 'react-split-pane'

class DeploymentEnvironments extends Component {
  renderEnv(env) {
    return (
      <Link
        to={`/admin/deployment/${env}`}
        className="ItemTypeRow"
        activeClassName="ItemTypeRow--active"
        key={env}
      >
        {this.t(`deploymentEnvironments.${env}`)}
      </Link>
    )
  }

  render() {
    return (
      <SplitPane minSize={300} defaultSize={400} split="vertical">
        <div>
          <div className="Items">
            <div className="Items__items">
              {['production'].map(this.renderEnv.bind(this))}
            </div>
          </div>
        </div>
        <div>
          {this.props.children}
        </div>
      </SplitPane>
    )
  }
}

DeploymentEnvironments.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.element,
}

export default DeploymentEnvironments

