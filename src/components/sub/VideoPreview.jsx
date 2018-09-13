import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { videoIFrameUrl } from 'utils/video'

class VideoPreview extends Component {
  constructor(props) {
    super(props)
    this.state = { showVideo: false }
  }

  handleSwitch(e) {
    e.preventDefault()
    this.setState({ showVideo: true })
  }

  renderThumb() {
    const { video, height } = this.props

    return (
      <div className="VideoPreview__thumb">
        <img
          className="VideoPreview__thumb__image"
          src={video.thumbnail_url}
          style={{ height }}
          alt="Preview"
        />
        <a
          href="#"
          onClick={this.handleSwitch.bind(this)}
          className="VideoPreview__thumb__play"
        >
          <i className="icon--play" />
        </a>
      </div>
    )
  }

  renderVideo() {
    const { video, height } = this.props
    const url = videoIFrameUrl(video)
    const width = Math.round((video.width * height) / video.height)

    return (
      <iframe
        frameBorder="0"
        allowFullScreen
        src={url}
        width={width}
        height={height}
      />
    )
  }

  render() {
    const { video, height } = this.props
    const width = Math.round((video.width * height) / video.height)

    return (
      <div className="VideoPreview" style={{ width, height }}>
        {this.state.showVideo ? this.renderVideo() : this.renderThumb()}
      </div>
    )
  }
}

VideoPreview.propTypes = {
  video: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
}

export default VideoPreview
