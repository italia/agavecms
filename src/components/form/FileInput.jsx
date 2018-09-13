import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import Dropzone from 'react-dropzone'
import uploadFile from 'api/uploadFile'
import { Line as ProgressBar } from 'rc-progress'
import imageUrl from 'utils/imageUrl'
import { alert } from 'actions/notifications'
import { uploadStart, uploadEnd } from 'actions/ui'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Modal from 'components/sub/Modal'
import MediaArea from 'components/routes/MediaArea'
import toCss from 'utils/toCss'
import getImageDimensions from 'utils/getImageDimensions'
import isImage from 'utils/isImage'

class FileInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      uploading: false,
      isModalOpen: false,
    }
  }

  handleCancelUpload(e) {
    e.preventDefault()

    if (this.upload) {
      this.upload.cancel()
    }

    this.props.dispatch(uploadEnd())

    this.setState({
      uploading: false,
      percent: 0,
    })
  }

  handleDrop([file]) {
    if (!file) {
      return
    }

    const validationError = this.props.validateFile(file)

    if (validationError) {
      const message = this.t('fileInput.invalidFile', { error: this.t(validationError) })
      this.props.dispatch(alert(message))
      return
    }

    this.props.dispatch(uploadStart())

    this.setState({
      uploading: true,
      percent: 0,
      droppedFile: file,
    })

    let fetchingImageDimensions
    if (isImage(file.name)) {
      fetchingImageDimensions = getImageDimensions(file.preview)
    } else {
      fetchingImageDimensions = Promise.resolve({})
    }

    this.upload = uploadFile(file, (percent) => {
      this.setState({ percent })
    })

    Promise.all([fetchingImageDimensions, this.upload.promise])
      .then((results) => {
        const dimensions = results[0]
        const response = results[1]
        const json = JSON.parse(response)

        const metadata = Object.assign({
          path: json.id,
          size: file.size,
          format: file.name.split('.').pop(),
        }, dimensions)
        this.props.dispatch(uploadEnd())
        this.setState({ uploading: false })
        this.props.onBlur(metadata)
      })
      .catch(() => {
        this.props.dispatch(alert(this.t('fileInput.uploadError')))
        this.props.dispatch(uploadEnd())

        this.setState({
          uploading: false,
          percent: 0,
        })
        this.upload = null
      })
  }

  handleClose() {
    this.setState({ isModalOpen: false })
  }

  handleBrowse(e) {
    e.preventDefault()
    e.stopPropagation()
    this.refs.dropzone.open()
  }

  handleReset(e) {
    e.preventDefault()
    this.props.onBlur(null)
  }

  handleOpenMediaGallery(e) {
    e.preventDefault()
    this.setState({ isModalOpen: true })
  }

  handleSelectFromGallery(files) {
    const newValue = files[0]
    this.props.onBlur(newValue)
    this.setState({
      isModalOpen: false,
    })
  }

  renderEmpty() {
    const { disabled } = this.props

    if (disabled) {
      return (
        <div className="FileInput">
          <div className="FileInput__dropzone__label">
            <FormattedMessage id="form.fileInput.noFiles" />
          </div>
        </div>
      )
    }

    return (
      <Dropzone
        ref="dropzone"
        multiple={false}
        disableClick
        className="FileInput__dropzone"
        activeClassName="FileInput__dropzone--active"
        rejectClassName="FileInput__dropzone--reject"
        onDrop={this.handleDrop.bind(this)}
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
            <a href="#" className="button--small" onClick={this.handleOpenMediaGallery.bind(this)}>
              <FormattedMessage id="form.galleryInput.openMediaGallery" />
            </a>
          </div>
        </div>
        {
          this.state.isModalOpen &&
            <Modal
              huge
              title="Select from Media gallery"
              onClose={this.handleClose.bind(this)}
            >
              <MediaArea
                onSelect={this.handleSelectFromGallery.bind(this)}
                embedded
                multiple={false}
              />
            </Modal>
        }
      </Dropzone>
    )
  }

  renderProgress() {
    const { previewComponent, primaryColor } = this.props

    return (
      <div className="FileInput">
        {previewComponent(this.state.droppedFile)}
        <div className="FileInput__progressHint">
          <FormattedMessage
            id="form.fileInput.uploadInProgress"
            values={{ percentage: this.state.percent || '0' }}
          />
        </div>
        <ProgressBar
          percent={this.state.percent}
          strokeColor={primaryColor}
        />
        <div className="FileInput__actions">
          <a
            href="#"
            onClick={this.handleCancelUpload.bind(this)}
            className="button--tiny button--alert"
          >
            <FormattedMessage id="form.fileInput.cancelButton" />
          </a>
        </div>
      </div>
    )
  }

  renderValue() {
    const { valueComponent, value, disabled } = this.props

    return (
      <div className="FileInput">
        {valueComponent(value)}
        {
          !disabled &&
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
    if (this.state.uploading) {
      return this.renderProgress()
    } else if (this.props.value) {
      return this.renderValue()
    }
    return this.renderEmpty()
  }
}

FileInput.propTypes = {
  value: PropTypes.object,
  onBlur: PropTypes.func,
  augmentFileMetadata: PropTypes.func.isRequired,
  previewComponent: PropTypes.func.isRequired,
  valueComponent: PropTypes.func.isRequired,
  validateFile: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  hint: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
}

FileInput.defaultProps = {
  augmentFileMetadata: value => value,
  previewComponent: (file) => {
    if (file.name.match(/.svg$/i)) {
      return (
        <div className="FileInput__image-preview">
          <img
            src={file.preview}
            height="150"
            alt="Preview"
          />
        </div>
      )
    }

    return <span>{file.name}</span>
  },
  valueComponent: (value) => {
    const name = value.path
      .replace(/^.*[\\\/]/, '')
      .replace(/^[0-9]+\-/, '')

    const downloadLink = imageUrl(value, { dl: name })

    if (value.path.match(/.svg$/i)) {
      return (
        <a
          className="FileInput__image-preview"
          href={downloadLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={imageUrl(value)}
            height="150"
            alt="Preview"
          />
        </a>
      )
    }

    return <a href={downloadLink}>{name}</a>
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

export default connect(mapStateToProps)(FileInput)
