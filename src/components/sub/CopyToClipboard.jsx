import Component from 'components/BaseComponent'
import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import copy from 'copy-to-clipboard'

class CopyToClipboard extends Component {
  constructor(props) {
    super(props)
    this.state = { copied: false }
  }

  handleCopy(e) {
    e.preventDefault()
    this.handleFocus()
    copy(this.props.value)
    this.setState({ copied: true })
    setTimeout(() => this.setState({ copied: false }), 2000)
  }

  handleFocus() {
    const input = ReactDOM.findDOMNode(this.refs.input)
    input.focus()
    input.setSelectionRange(0, input.value.length)
  }

  renderMultiline() {
    return (
      <div className="copy-to-clipboard">
        <textarea
          rows={this.props.rows}
          {...this.props}
          ref="input"
          readOnly
          onFocus={this.handleFocus.bind(this)}
        />
        <a
          href="#"
          className="copy-to-clipboard__button"
          onClick={this.handleCopy.bind(this)}
        >
          {
            this.state.copied ?
              this.t('clipboard.copied') :
              this.t('clipboard.copy')
          }
        </a>
      </div>
    )
  }

  renderSingleLine() {
    return (
      <div className="input-group">
        <input
          {...this.props}
          ref="input"
          readOnly
          type="text"
          onFocus={this.handleFocus.bind(this)}
        />
        <a
          href="#"
          className="input-group__addon input-group__addon--button"
          onClick={this.handleCopy.bind(this)}
        >
          {
            this.state.copied ?
              this.t('clipboard.copied') :
              this.t('clipboard.copy')
          }
        </a>
      </div>
    )
  }

  render() {
    return this.props.multiline ?
      this.renderMultiline() :
      this.renderSingleLine()
  }
}

CopyToClipboard.propTypes = {
  value: PropTypes.string,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
}

CopyToClipboard.defaultProps = {
  multiline: false,
}

export default CopyToClipboard

