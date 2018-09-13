import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import Notifications from 'components/sub/Notifications'

class App extends Component {
  getChildContext() {
    return {
      route: this.props.routes[this.props.routes.length - 1],
    }
  }

  render() {
    return (
      <div>
        <Notifications />
        {this.props.children}
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  routes: PropTypes.array.isRequired,
}

App.childContextTypes = {
  route: PropTypes.object.isRequired,
}

export default App
