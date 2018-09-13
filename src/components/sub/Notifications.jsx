import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import { dismiss } from 'actions/notifications'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class Notifications extends Component {
  handleDismiss(id, e) {
    e.preventDefault()
    this.props.dispatch(dismiss(id))
  }

  renderNotification({ id, type, message }) {
    return (
      <div
        key={id}
        className={`Notifications__item Notifications__item--${type}`}
      >
        <div className="Notifications__item__inner">
          <div className="Notifications__item__message">
            {message}
          </div>
          <a
            href="#"
            className="Notifications__item__close"
            onClick={this.handleDismiss.bind(this, id)}
          >
            {this.t('notifications.hide')}
          </a>
        </div>
      </div>
    )
  }

  render() {
    const { notifications } = this.props
    return (
      <div className="Notifications">
        <ReactCSSTransitionGroup
          transitionName="show"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {notifications.map(this.renderNotification.bind(this))}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

Notifications.propTypes = {
  notifications: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps({ notifications }) {
  return { notifications }
}

export default connect(mapStateToProps)(Notifications)
