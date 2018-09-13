import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'

export class Tabs extends Component {
  constructor(props) {
    super(props)
    this.state = { activeIndex: 0 }
  }

  handleClick(index, e) {
    e.preventDefault()
    this.setState({ activeIndex: index })
  }

  renderHandle(child, index) {
    if (!child) {
      return undefined
    }

    const className = ['Tabs__handle']

    if (index === this.state.activeIndex) {
      className.push('is-active')
    } else if (child.props.invalid) {
      className.push('is-invalid')
    }

    return (
      <a
        key={index}
        href="#"
        onClick={this.handleClick.bind(this, index)}
        className={className.join(' ')}
      >
        {this.t(child.props.intlLabel)}
      </a>
    )
  }

  renderContent(child, index) {
    if (!child) {
      return undefined
    }

    return (
      <div
        key="content"
        className="Tabs__content"
        style={{ display: (index === this.state.activeIndex ? 'block' : 'none') }}
      >
        {child.props.children}
      </div>
    )
  }

  render() {
    const { children } = this.props

    return (
      <div className="Tabs">
        <div className="Tabs__handles">
          {React.Children.map(children, this.renderHandle.bind(this))}
        </div>
        {React.Children.map(children, this.renderContent.bind(this))}
      </div>
    )
  }
}

Tabs.propTypes = {
  children: PropTypes.node,
}

export function Tab() {
  return null
}
