// https://github.com/reactjs/react-router/issues/470
// https://gist.github.com/gaearon/dfb80954a524709bcaf3bc584d9db11f

import React, { PropTypes, Component } from 'react'
import { withRouter, Link as RouterLink } from 'react-router'

class Link extends Component {
  componentDidMount() {
    this.unsubscribe = this.props.router.listen(nextLocation => {
      if (this.location !== nextLocation) {
        this.location = nextLocation
        this.forceUpdate()
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    return <RouterLink {...this.props} />
  }
}

Link.propTypes = {
  router: PropTypes.object.isRequired,
}

export default withRouter(Link)
