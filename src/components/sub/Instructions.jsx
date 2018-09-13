import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import ReactDOM from 'react-dom'

export default class Instructions extends Component {
  componentDidMount() {
    const links = ReactDOM.findDOMNode(this).querySelectorAll('a')
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        if (e.target.host === window.location.host) {
          e.preventDefault()
          this.pushRoute(e.target.pathname)
        }
      })
    })
  }

  render() {
    return (
      <div
        className="formatted-content"
        dangerouslySetInnerHTML={{ __html: this.props.value }}
      />
    )
  }
}

Instructions.propTypes = {
  value: PropTypes.string.isRequired,
}
