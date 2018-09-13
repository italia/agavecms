import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import { dumpUrl } from 'api/agave'
import { getCurrentRole } from 'utils/storeQueries'

class DumpButton extends Component {
  handleDump(env, e) {
    e.preventDefault()

    document.location = dumpUrl()
  }

  render() {
    const env = 'production'
    const hasPermission = this.props.permissions[env]

    return (
      hasPermission ?
        <a
          href="#"
          className="DumpButton DumpButton--reverse"
          onClick={this.handleDump.bind(this, env)}
        >
          <i className="icon--download-cloud" />
          <span>{this.t('deployPanel.dump.label')}</span>
        </a>
        :
        null
    )
  }
}

DumpButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  permissions: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  const role = getCurrentRole(state)

  return {
    site: state.site,
    permissions: {
      production: role && role.attributes.can_dump_data,
    },
  }
}

export default connect(mapStateToProps)(DumpButton);
