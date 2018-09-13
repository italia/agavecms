import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import toCss from 'utils/toCss'

class FileInputBase extends Component {
  handleBrowse(e) {
    e.preventDefault()
    e.stopPropagation()
    this.refs.dropzone.open()
  }

  handleReset(e) {
    e.preventDefault()
    this.props.onBlur(null)
  }

  handleOnDrop([files]) {
    if (!files) {
      return
    }

    this.props.onChange(files)
  }

  renderEmpty() {
    return (
      <Dropzone
        ref="dropzone"
        multiple={false}
        disableClick
        className="FileInput__dropzone"
        activeClassName="FileInput__dropzone--active"
        rejectClassName="FileInput__dropzone--reject"
        onDrop={this.handleOnDrop.bind(this)}
      >
        <div>
          <div className="FileInput__dropzone__label">
            <FormattedMessage id="form.fileInput.dragHere" />
          </div>
          {
            this.props.hint &&
              <div className="FileInput__dropzone__hint">
                <FormattedMessage id={this.props.hint} />
              </div>
          }
          <div className="FileInput__actions">
            <a href="#" className="button--small" onClick={this.handleBrowse.bind(this)}>
              <FormattedMessage id="form.fileInput.buttonLabel" />
            </a>
          </div>
        </div>
      </Dropzone>
    )
  }

  renderValue() {
    const { valueComponent, value } = this.props

    return (
      <div className="FileInput">
        {valueComponent(value)}
        {
          <div className="FileInput__actions">
            <a
              href="#"
              onClick={this.handleReset.bind(this)}
              className="button--tiny button--alert"
            >
              <i className="icon--delete" />
              <span><FormattedMessage id="form.fileInput.removeImage" /></span>
            </a>
          </div>
        }
      </div>
    )
  }

  render() {
    if (this.props.value) {
      return this.renderValue()
    }
    return this.renderEmpty()
  }
}

FileInputBase.propTypes = {
  value: PropTypes.object,
  onBlur: PropTypes.func,
  validateFile: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  valueComponent: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  hint: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
}

FileInputBase.defaultProps = {
  valueComponent: (value) => {
    const name = value.name
      .replace(/^.*[\\\/]/, '')
      .replace(/^[0-9]+\-/, '')
    return <span>{name}</span>
  },
  validateFile: (file) => {
    // soft limit on 150MB
    if (file.size > 150000000) {
      return 'fileInput.error.tooBig'
    }
    return undefined
  },
  hint: 'form.fileInput.hint',
}

function mapStateToProps(state) {
  return { primaryColor: toCss(state.ui.colors.primaryColor) }
}

export default connect(mapStateToProps)(FileInputBase)
