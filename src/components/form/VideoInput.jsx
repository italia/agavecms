import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { fetchVideoMetadata } from 'utils/video'
import VideoPreview from 'components/sub/VideoPreview'
import { connect } from 'react-redux'
import { alert } from 'actions/notifications'

class VideoInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      inProgess: false,
      url: '',
    }
  }

  handleChange(e) {
    const { dispatch } = this.props

    this.setState({ url: e.target.value, inProgess: true })

    fetchVideoMetadata(e.target.value)
      .then((attributes) => {
        const value = Object.assign({}, this.props.value, attributes)
        this.props.onBlur(value)
        this.setState({ url: '', inProgess: false })
      })
      .catch(() => {
        dispatch(alert(this.t('videoInput.invalidUrl')))
        this.setState({ inProgess: false })
      })
  }

  handleFocus(e) {
    e.target.select()
  }

  handleBrowse(e) {
    e.preventDefault()
    this.refs.dropzone.open()
  }

  handleReset(e) {
    e.preventDefault()
    this.props.onBlur(null)
  }

  renderEmpty() {
    const { disabled } = this.props

    if (disabled) {
      return (
        <div className="VideoInput">
          <div className="VideoInput__no-video">
            {this.t('videoInput.noVideo')}
          </div>
        </div>
      )
    }

    return (
      <div className="VideoInput VideoInput--empty">
        <div className="VideoInput__label">
          {this.t('videoInput.hint')}
        </div>
        <input
          type="text"
          className="VideoInput__input"
          onChange={this.handleChange.bind(this)}
          onFocus={this.handleFocus.bind(this)}
          disabled={this.state.inProgess}
          value={this.state.url}
        />
      </div>
    )
  }

  renderValue() {
    const { value, disabled } = this.props

    return (
      <div className="VideoInput">
        <VideoPreview video={value} height={250} />
        {
          !disabled &&
            <div className="VideoInput__actions">
              <a
                href="#"
                onClick={this.handleReset.bind(this)}
                className="button--tiny button--alert"
              >
                <i className="icon--delete" />
                <span>{this.t('videoInput.remove')}</span>
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

VideoInput.propTypes = {
  value: PropTypes.object,
  onBlur: PropTypes.func,
  dispatch: PropTypes.func,
  disabled: PropTypes.bool,
}

export default connect()(VideoInput)
