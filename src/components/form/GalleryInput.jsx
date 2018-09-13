import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import Dropzone from 'react-dropzone'
import u from 'updeep'
import uploadFile from 'api/uploadFile'
import { Circle as ProgressBar } from 'rc-progress'
import { alert } from 'actions/notifications'
import { uploadStart, uploadEnd } from 'actions/ui'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import FluidGrid from 'components/sub/FluidGrid'
import GalleryItem from 'components/form/GalleryItem'
import switchElements from 'utils/switchElements'
import Modal from 'components/sub/Modal'
import MediaArea from 'components/routes/MediaArea'
import toCss from 'utils/toCss'
import getImageDimensions from 'utils/getImageDimensions'

const validateFile = (file) => {
  if (!file.name.match(/\.(png|gif|jpe?g|svg)$/i)) {
    return 'fileInput.error.notAnImage'
  } else if (file.size > 10000000) {
    return 'imageInput.error.tooBig'
  }
  return undefined
}

class GalleryInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      uploads: [],
      pendingMovement: null,
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextState.disableUpdate) {
      return false
    }

    return super.shouldComponentUpdate(nextProps, nextState, nextContext)
  }

  handleDragFileStart(e) {
    const { pendingMovement } = this.state
    if (pendingMovement) {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  handleDropFile(files) {
    const uploads = files.map(file => {
      const validationError = validateFile(file)

      if (validationError) {
        const message = this.t(
          'fileInput.invalidFile', { error: this.t(validationError) })
        this.props.dispatch(alert(message))
        return null
      }

      return this.startUpload(file)
    }).filter(upload => !!upload)

    this.setState({ uploads })
  }

  handleBrowse(e) {
    e.preventDefault()
    e.stopPropagation()
    this.refs.dropzone.open()
  }

  handleClose() {
    this.setState({ isModalOpen: false })
  }

  handleDelete(image) {
    this.props.onBlur(this.props.value.filter(i => i.path !== image.path))
  }

  handleMetadataChange(image, metadata) {
    const { value } = this.props
    const index = value.findIndex(i => i.path === image.path)
    const newValue = u({ [index]: metadata }, value)
    this.props.onBlur(newValue)
  }

  handleDrag(pendingMovement) {
    this.setState({ pendingMovement })
  }

  handleDrop() {
    if (!this.state.pendingMovement) {
      return
    }

    const { fromIndex, toIndex } = this.state.pendingMovement
    this.setState({ pendingMovement: null })
    this.props.onBlur(switchElements(this.props.value, fromIndex, toIndex))
  }

  handleDropCancel() {
    this.setState({ pendingMovement: null })
  }

  handleOpenMediaGallery(e) {
    e.preventDefault()
    this.setState({ isModalOpen: true })
  }

  handleSelectFromGallery(files) {
    const newValue = [].concat(this.props.value, files)
    this.props.onBlur(newValue)
    this.setState({
      isModalOpen: false,
    })
  }

  startUpload(file) {
    this.props.dispatch(uploadStart())

    const id = Math.random().toString(36).substring(7)

    const fetchingImageDimensions = getImageDimensions(file.preview)

    const uploading = uploadFile(file, (percent) => {
      const index = this.state.uploads.findIndex(upload => upload.id === id)
      this.setState({
        uploads: u({ [index]: { percent } }, this.state.uploads),
      })
    })

    Promise.all([fetchingImageDimensions, uploading.promise])
      .then((results) => {
        const { height, width } = results[0]
        const response = results[1]
        const json = JSON.parse(response)

        const metadata = {
          path: json.id,
          size: file.size,
          format: file.name.split('.').pop().toLowerCase(),
          height,
          width,
        }

        this.props.dispatch(uploadEnd())

        this.setState({
          disableUpdate: true,
          uploads: this.state.uploads.filter(upload => upload.id !== id),
        })

        const value = this.props.value

        if (!value) {
          this.props.onBlur([metadata])
        } else {
          this.props.onBlur(value.concat(metadata))
        }

        this.setState({
          disableUpdate: false,
        })
      })
      .catch(error => {
        this.props.dispatch(uploadEnd())

        this.setState({
          uploads: this.state.uploads.filter(upload => upload.id !== id),
        })

        if (error && error.data && error.data[0].id === 'FILE_STORAGE_QUOTA_EXCEEDED') {
          this.props.dispatch(alert(this.t('fileInput.quotaExceeded')))
        } else {
          this.props.dispatch(alert(this.t('fileInput.uploadError')))
          throw error
        }
      })

    return {
      id,
      file,
      percent: 0,
      uploading,
    }
  }

  handleCancelUpload(upload, e) {
    e.preventDefault()
    e.stopPropagation()

    upload.uploading.cancel()
    this.props.dispatch(uploadEnd())

    this.setState({
      uploads: this.state.uploads.filter(({ id }) => id !== upload.id),
    })
  }

  renderProgress(upload) {
    const { id, file, percent } = upload
    const { primaryColor } = this.props

    return (
      <div className="GalleryInput__item" key={id}>
        <div className="GalleryInput__item__image-preview">
          <img src={file.preview} alt="Preview" />
        </div>
        <div className="GalleryInput__item__overlay">
          <div className="GalleryInput__item__progress">
            <ProgressBar
              percent={percent}
              strokeWidth={8}
              strokeColor={primaryColor}
            />
          </div>
        </div>
        <div className="GalleryInput__item__actions">
          <a
            href="#"
            onClick={this.handleCancelUpload.bind(this, upload)}
            className="GalleryInput__item__button"
          >
            <i className="icon--cross" />
          </a>
        </div>
      </div>
    )
  }

  renderValue(value, index) {
    const { disabled } = this.props
    return (
      <GalleryItem
        sortable={this.props.multiple && this.props.value.length > 1}
        key={`${value.path}-${index}`}
        onDelete={this.handleDelete.bind(this, value)}
        onMetadataChange={this.handleMetadataChange.bind(this, value)}
        value={value}
        index={index}
        disabled={disabled}
        editMetadata={this.props.editMetadata}
        onDrag={this.handleDrag.bind(this)}
        onDrop={this.handleDrop.bind(this)}
        onDropCancel={this.handleDropCancel.bind(this)}
        dropTargetName={this.props.id}
      />
    )
  }

  renderEmpty() {
    const { disabled } = this.props

    if (disabled) {
      return (
        <div className="GalleryInput__empty">
          <div className="GalleryInput__empty__label">
            <FormattedMessage id="form.galleryInput.noImages" />
          </div>
        </div>
      )
    }

    return (
      <div className="GalleryInput__empty">
        <div className="GalleryInput__empty__label">
          <FormattedMessage id="form.galleryInput.dragHere" />
        </div>
        <div className="GalleryInput__empty__hint">
          <FormattedMessage id={'form.imageInput.hint'} />
        </div>
        <div className="GalleryInput__empty__actions">
          <a href="#" className="button--small" onClick={this.handleBrowse.bind(this)}>
            <FormattedMessage id="form.galleryInput.emptyButtonLabel" />
          </a>
          <a href="#" className="button--small" onClick={this.handleOpenMediaGallery.bind(this)}>
            <FormattedMessage id="form.galleryInput.openMediaGallery" />
          </a>
        </div>
      </div>
    )
  }

  renderGrid() {
    const { uploads, pendingMovement } = this.state
    const { value, multiple, disabled } = this.props

    const readyUploads = uploads
      .filter(upload => upload.width && upload.height)

    let valueItems = value || []

    if (pendingMovement) {
      const { fromIndex, toIndex } = this.state.pendingMovement
      valueItems = switchElements(valueItems, fromIndex, toIndex)
    }

    const sizes = [].concat(valueItems, readyUploads)
      .map((item) => ({ width: item.width, height: item.height }))

    return (
      <div>
        <FluidGrid gutter={16} rowHeight={150} sizes={sizes}>
          { valueItems.map(this.renderValue, this) }
          { readyUploads.map(this.renderProgress, this) }
        </FluidGrid>
        {
          multiple && !disabled &&
            <div className="GalleryInput__empty__actions">
              <a href="#" className="button--small" onClick={this.handleBrowse.bind(this)}>
                <FormattedMessage id="form.galleryInput.buttonLabel" />
              </a>
              <a
                href="#"
                className="button--small"
                onClick={this.handleOpenMediaGallery.bind(this)}
              >
                <FormattedMessage id="form.galleryInput.openMediaGallery" />
              </a>
            </div>
        }

      </div>
    )
  }

  renderContent() {
    const { uploads } = this.state
    const { value } = this.props

    return uploads.length === 0 && (!value || value.length === 0) ?
      this.renderEmpty() :
      this.renderGrid()
  }

  render() {
    const { multiple, value, disabled } = this.props

    if ((multiple || !value || value.length === 0) && !disabled) {
      return (
        <Dropzone
          ref="dropzone"
          multiple={multiple}
          disableClick
          className="GalleryInput"
          activeClassName="GalleryInput is-dropping"
          rejectClassName="GalleryInput is-rejecting"
          accept="image/*"
          onDrop={this.handleDropFile.bind(this)}
          onDragStart={this.handleDragFileStart.bind(this)}
        >
          {this.renderContent()}
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
                  multiple={multiple}
                />
              </Modal>
          }
        </Dropzone>
      )
    }

    return (
      <div className="GalleryInput">
        {this.renderContent()}
      </div>
    )
  }
}

GalleryInput.propTypes = {
  value: PropTypes.array,
  onBlur: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
  multiple: PropTypes.bool.isRequired,
  editMetadata: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  primaryColor: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  router: React.PropTypes.object,
  location: PropTypes.object,
}

GalleryInput.defaultProps = {
  multiple: true,
  editMetadata: true,
}

function mapStateToProps(state) {
  return { primaryColor: toCss(state.ui.colors.primaryColor) }
}

export default connect(mapStateToProps)(GalleryInput)
