import React, { PropTypes } from 'react'

import Component from 'components/BaseComponent'
import {
  DragSource as dragSource,
  DropTarget as dropTarget,
} from 'react-dnd'
import Modal from 'components/sub/Modal'
import ImageMetadataForm from 'components/sub/ImageMetadataForm'
import { handleHorizontalHover } from 'utils/hover'
import imageUrl from 'utils/imageUrl'

class GalleryItem extends Component {
  constructor(props) {
    super(props)
    this.state = { isModalOpen: false }
  }

  handleDelete(e) {
    e.preventDefault()
    this.props.onDelete()
  }

  handleMetadataOpen(e) {
    e.preventDefault()
    this.setState({ isModalOpen: true })
  }

  handleMetadataClose() {
    this.setState({ isModalOpen: false })
  }

  handleMetadataChange(value) {
    this.setState({ isModalOpen: false })
    this.props.onMetadataChange(value)
  }

  render() {
    const {
      value,
      sortable,
      isDragging,
      connectDragSource,
      connectDropTarget,
      disabled,
    } = this.props

    const className = ['GalleryInput__item']

    if (sortable && !disabled) {
      className.push('is-draggable')
    }

    if (isDragging) {
      className.push('is-dragging')
    }

    return connectDropTarget(connectDragSource(
      <div>
        <div className={className.join(' ')}>
          <div className="GalleryInput__item__image-preview">
            <img src={imageUrl(value)} alt="Preview" />
          </div>
          {
            (value.alt || value.title) &&
              <div className="GalleryInput__item__caption">
                <p>{value.title || value.alt}</p>
              </div>
          }
          {
            !disabled &&
              <div className="GalleryInput__item__actions on-hover">
                {
                  this.props.editMetadata &&
                    <a
                      href="#"
                      onClick={this.handleMetadataOpen.bind(this)}
                      className="GalleryInput__item__button"
                    >
                      <i className="icon--alt" />
                    </a>
                }
                <a
                  href="#"
                  onClick={this.handleDelete.bind(this)}
                  className="GalleryInput__item__button GalleryInput__item__button--danger"
                >
                  <i className="icon--delete" />
                </a>
              </div>
          }
        </div>
        {
          this.state.isModalOpen &&
            <Modal
              huge
              onClose={this.handleMetadataClose.bind(this)}
              title="Edit Image metadata"
            >
              <ImageMetadataForm
                onSubmit={this.handleMetadataChange.bind(this)}
                metadata={value}
              />
            </Modal>
        }
      </div>
    ))
  }
}

GalleryItem.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool,
  onDrag: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDropCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  onMetadataChange: PropTypes.func.isRequired,
  sortable: PropTypes.bool.isRequired,
  value: PropTypes.object.isRequired,
  editMetadata: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
}

GalleryItem.defaultProps = {
  editMetadata: true,
}

const applyDragSource = dragSource(
  (props) => props.dropTargetName,
  {
    canDrag(props) {
      return props.sortable && !props.disabled
    },

    beginDrag(props) {
      return {
        index: props.index,
      }
    },

    endDrag(props, monitor) {
      const didDrop = monitor.didDrop()

      if (!didDrop) {
        props.onDropCancel()
      } else {
        props.onDrop()
      }
    },
  },
  (connect, monitor) => {
    return {
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging(),
    }
  }
)

const applyDropTarget = dropTarget(
  (props) => props.dropTargetName,
  {
    hover(props, monitor, component) {
      handleHorizontalHover(props, monitor, component)
    },
  },
  (connect) => {
    return {
      connectDropTarget: connect.dropTarget(),
    }
  }
)

export default applyDragSource(applyDropTarget(GalleryItem))
