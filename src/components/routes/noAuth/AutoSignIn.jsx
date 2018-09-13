import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import Spinner from 'components/sub/Spinner'

import { connect } from 'react-redux'
import { force as forceSession } from 'actions/session'
import { alert, notice } from 'actions/notifications'

class AutoSignIn extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    const accessToken = this.props.location.query.access_token

    if (accessToken) {
      dispatch(forceSession({ bearerToken: accessToken }))
      .then(() => {
        dispatch(notice(this.t('noAuth.signIn.create.success')))
        this.pushRoute('/editor')
      })
      .catch(() => {
        dispatch(alert(this.t('noAuth.signIn.create.failure')))
      })
    }
  }

  render() {
    return (
      <div className="FullpageLoader">
        <Spinner size={100} />
      </div>
    )
  }
}

AutoSignIn.propTypes = {
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
}

export default connect()(AutoSignIn)
