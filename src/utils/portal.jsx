/* eslint-disable react/no-multi-comp */

import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { intlShape } from 'react-intl'

export default (domNodeFactory) => (InnerComponent) => {
  class ContextForwarder extends React.Component {
    getChildContext() {
      return this.props.context
    }

    render() {
      return (
        <div>{this.props.children}</div>
      )
    }
  }

  ContextForwarder.propTypes = {
    children: PropTypes.node.isRequired,
    context: PropTypes.object.isRequired,
  }

  ContextForwarder.childContextTypes = {
    intl: intlShape,
    router: PropTypes.object,
    store: PropTypes.object,
    dragDropManager: PropTypes.object,
  }

  class Portal extends React.Component {
    componentDidMount() {
      this.renderTarget()
    }

    componentDidUpdate() {
      this.renderTarget()
    }

    componentWillUnmount() {
      ReactDOM.unmountComponentAtNode(this.targetDomNode)
    }

    renderTarget() {
      const domNode = this.targetDomNode || domNodeFactory()

      const root = (
        <ContextForwarder context={this.context}>
          <InnerComponent {...this.props} />
        </ContextForwarder>
      )

      ReactDOM.render(root, domNode)
      this.targetDomNode = domNode
    }

    render() {
      return null
    }
  }

  Portal.displayName = `Portal(${InnerComponent.name})`

  Portal.contextTypes = {
    intl: intlShape,
    router: PropTypes.object,
    store: PropTypes.object,
    dragDropManager: PropTypes.object,
  }

  return Portal
}
