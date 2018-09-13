import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import { getCurrentUser } from 'utils/storeQueries'
import Spinner from 'components/sub/Spinner'

class Dashboard extends Component {
  renderWelcome() {
    const { currentUser } = this.props
    const name = currentUser.type === 'account' ?
      'Admin' :
      currentUser.attributes.first_name

    return (
      <div className="Dashboard__inner">
        <div className="Dashboard__inner__bg" />
        <div className="Dashboard__inner__content">
          <div className="Dashboard__image" />
          <h1 className="Dashboard__title">
            {this.t('dashboard.title', { name })}
          </h1>
          <div className="Dashboard__body">
            {this.t('dashboard.description')}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { currentUser } = this.props

    return (
      <div className="Dashboard">
        <div className="Dashboard__opacity">
          {
            currentUser ?
              this.renderWelcome() :
              <Spinner size={100} />
          }
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
}

function mapStateToProps(state) {
  const currentUser = getCurrentUser(state)

  return { currentUser }
}

export default connect(mapStateToProps)(Dashboard)
