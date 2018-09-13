import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { Circle as ProgressBar } from 'rc-progress'
import { connect } from 'react-redux'
import FluidGrid from 'components/sub/FluidGrid'
import imageUrl, { hasPreviewImage } from 'utils/imageUrl'
import toCss from 'utils/toCss'

class MediaGallery extends Component {
  render() {
    const { uploads, tempUploads } = this.props

    return tempUploads.length === 0 && (!uploads || uploads.length === 0) ?
      this.renderEmpty() :
      this.renderGrid()
  }

  renderEmpty() {
    return (
      <div className="MediaArea__empty">
        <div className="MediaArea__empty__title">
          Nothing to see here!
        </div>
        <div className="MediaArea__empty__sub">
          Would you like to upload something?
          Drop some files here, or press the "Upload New" button above.
        </div>
      </div>
    )
  }

  renderGrid() {
    const { tempUploads, onSelect } = this.props

    const uploads = (this.props.uploads || []).filter(item => !!item)

    const sizes = [].concat(uploads, tempUploads)
      .filter((item) => item)
      .map((item) => ({ width: item.width, height: item.height }))

    return (
      <FluidGrid gutter={20} rowHeight={150} sizes={sizes}>
        { tempUploads.map(this.renderProgress.bind(this)) }
        {
          onSelect ?
            uploads.map(this.renderSelectableUpload, this) :
            uploads.map(this.renderUpload, this)
        }
      </FluidGrid>
    )
  }

  renderProgress(upload) {
    const { id, file, percent } = upload
    const { primaryColor } = this.props

    return (
      <div className="GalleryInput__item" key={id}>
        <div className="GalleryInput__item__image-preview">
          <div
            className="GalleryInput__item__image-preview__temp"
            style={{ backgroundImage: `url(${file.preview})` }}
          />
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
            onClick={this.props.onUploadCancel.bind(this, upload)}
            className="GalleryInput__item__button"
          >
            <i className="icon--cross" />
          </a>
        </div>
      </div>
    )
  }

  renderSelectableUpload(upload) {
    const { attributes } = upload

    const className = [
      'GalleryInput__item',
      'GalleryInput__item--selectable',
    ]

    if (this.props.selection.find(u => u.path === attributes.path)) {
      className.push('is-selected')
    }

    return (
      <div
        key={upload.id}
        className={className.join(' ')}
        onClick={this.props.onSelect.bind(this, upload)}
      >
        {this.renderPreview(attributes)}
        <div className="GalleryInput__item__caption">
          <p>
            {
              attributes.title ||
                attributes.alt ||
                attributes.path.replace(/^.*[\\\/]\d+\-/, '')
            }
          </p>
        </div>
      </div>
    )
  }

  renderUpload(upload) {
    const attributes = upload.attributes

    const className = ['GalleryInput__item']

    return (
      <div key={upload.id}>
        <div className={className.join(' ')}>
          {this.renderPreview(attributes)}
          <div className="GalleryInput__item__actions on-hover">
            {
              attributes.is_image &&
                <a
                  href="#"
                  onClick={this.props.onUploadEdit.bind(this, upload)}
                  className="GalleryInput__item__button"
                >
                  <i className="icon--edit" />
                </a>
            }
            <a
              href="#"
              onClick={this.props.onUploadDelete.bind(this, upload)}
              className="GalleryInput__item__button GalleryInput__item__button--danger"
            >
              <i className="icon--delete" />
            </a>
          </div>
        </div>
      </div>
    )
  }

  renderPreview(attributes) {
    const hasPreview = hasPreviewImage(attributes)

    return (
      <div>
        {
          hasPreview &&
            <div>
              <div className="GalleryInput__item__image-preview">
                <img
                  src={imageUrl(attributes, { w: 250, h: 250, mode: 'crop' })}
                  alt="Preview"
                  key={attributes.path}
                />
              </div>
              <div className="GalleryInput__item__caption">
                <p>
                  {
                    attributes.title ||
                      attributes.alt ||
                      attributes.path.replace(/^.*[\\\/]\d+\-/, '')
                  }
                </p>
              </div>
            </div>
        }
        {
          !hasPreview &&
            <div className="GalleryInput__item__image-preview__document">
              <div>
                <i className="icon--document" />
                <p className="GalleryInput__item__image-preview__document--text">
                    {
                      attributes.path.replace(/^.*[\\\/]\d+\-/, '')
                    }
                </p>
              </div>
            </div>
        }
      </div>
    )
  }
}

MediaGallery.propTypes = {
  uploads: PropTypes.array,
  onUploadDelete: PropTypes.func.isRequired,
  onUploadEdit: PropTypes.func,
  onUploadCancel: PropTypes.func,
  onSelect: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
  multiple: PropTypes.bool.isRequired,
  primaryColor: PropTypes.string.isRequired,
  tempUploads: PropTypes.array,
  selection: PropTypes.array,
}

MediaGallery.defaultProps = {
  multiple: true,
}

function mapStateToProps(state) {
  return { primaryColor: toCss(state.ui.colors.primaryColor) }
}

export default connect(mapStateToProps)(MediaGallery)
