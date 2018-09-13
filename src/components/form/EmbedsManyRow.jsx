import React, { PropTypes } from 'react'
import getFieldValue from 'utils/getFieldValue'
import imageUrl, { hasPreviewImage } from 'utils/imageUrl'
import {
  DragSource as dragSource,
  DropTarget as dropTarget,
} from 'react-dnd'
import Component from 'components/BaseComponent'
import buildTitleFromValue from 'utils/buildTitleFromValue'
import { handleVerticalHover } from 'utils/hover'
import getFirstNonEmptyImageValue from 'utils/getFirstNonEmptyImageValue'

class EmbedsManyRow extends Component {
  handleEditClick(e) {
    e.preventDefault()
    this.props.onEdit()
  }

  handleDestroyClick(e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.onDestroy()
  }

  renderHandle() {
    const { connectDragSource } = this.props

    return connectDragSource(
      <div className="EmbedsManyRow__handle">
        <i className="icon--hamburger" />
      </div>
    )
  }

  renderActions() {
    const { disabled } = this.props

    return (
      <div>
        <a
          href="#"
          onClick={this.handleEditClick.bind(this)}
          className="button button--micro"
        >
          {this.t('embedsManyInput.edit')}
        </a>
        {' '}
        {
          !disabled &&
            <a
              href="#"
              onClick={this.handleDestroyClick.bind(this)}
              className="button button--micro button--alert"
            >
              {this.t('embedsManyInput.remove')}
            </a>
        }
      </div>
    )
  }

  render() {
    const {
      item,
      locales,
      titleField,
      itemTypeName,
      showImage,
      imageFields,
      isDragging,
      connectDragPreview,
      connectDropTarget,
      sortingEnabled,
    } = this.props

    const title = buildTitleFromValue(
      getFieldValue(item, titleField, locales),
      titleField
    )
    const image = getFirstNonEmptyImageValue(item, imageFields)

    const className = ['EmbedsManyRow']

    if (isDragging) {
      className.push('is-dragging')
    }

    if (showImage) {
      className.push('has-image')
    }

    return connectDragPreview(connectDropTarget(
      <div className={className.join(' ')}>
        {sortingEnabled && this.renderHandle()}
        {
          showImage &&
            <div className="EmbedsManyRow__image">
              {
                hasPreviewImage(image) &&
                  <img
                    src={imageUrl(image, { w: 70, h: 70, mode: 'crop' })}
                    alt="Preview"
                  />
              }
              {
                !hasPreviewImage(image) &&
                  <div className="EmbedsManyRow__image__placeholder" />
              }
            </div>
        }
        <div className="EmbedsManyRow__content">
          {
            itemTypeName &&
              <div className="EmbedsManyRow__content__details">
                {itemTypeName}
              </div>
          }
          {
            titleField &&
              <div className="EmbedsManyRow__content__title">
                {title || this.t('item.untitled')}
                {
                  !item.attributes.is_valid &&
                    <div className="EmbedsManyRow__invalid-tag" />
                }
              </div>
          }
          {this.renderActions()}
        </div>
      </div>
    ))
  }
}

EmbedsManyRow.propTypes = {
  dndType: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  locales: PropTypes.array.isRequired,
  titleField: PropTypes.object,
  imageFields: PropTypes.object,
  fields: PropTypes.array.isRequired,
  showImage: PropTypes.bool,
  itemTypeName: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  onDestroy: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDropCancel: PropTypes.func.isRequired,
  sortingEnabled: PropTypes.bool,
  disabled: PropTypes.bool,
}

const applyDragSource = dragSource(
  (props) => props.dndType,
  {
    canDrag(props) {
      return props.sortingEnabled
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
  (props) => props.dndType,
  {
    hover(props, monitor, component) {
      handleVerticalHover(props, monitor, component)
    },
  },
  (connect) => {
    return {
      connectDropTarget: connect.dropTarget(),
    }
  }
)

export default applyDragSource(applyDropTarget(EmbedsManyRow))
