import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import Link from 'components/sub/Link'
import getFieldValue from 'utils/getFieldValue'
import getFirstNonEmptyImageValue from 'utils/getFirstNonEmptyImageValue'
import imageUrl, { hasPreviewImage } from 'utils/imageUrl'
import {
  DragSource as dragSource,
  DropTarget as dropTarget,
} from 'react-dnd'
import buildTitleFromValue from 'utils/buildTitleFromValue'
import { handleVerticalHover } from 'utils/hover'

class ItemRow extends Component {
  render() {
    const {
      itemType,
      item,
      locales,
      titleField,
      imageFields,
      connectDragPreview,
      connectDropTarget,
      connectDragSource,
      sortingEnabled,
      isDragging,
    } = this.props

    const title = buildTitleFromValue(
      getFieldValue(item, titleField, locales),
      titleField
    )

    const image = getFirstNonEmptyImageValue(item, imageFields)

    const url = `/editor/item_types/${itemType.id}/items/${item.id}`
    const { sortable } = itemType.attributes

    const className = ['ItemRow']

    if (isDragging) {
      className.push('is-dragging')
    }

    if (this.context.router.isActive(url)) {
      className.push('ItemRow--active')
    }

    return connectDragPreview(connectDropTarget(
      <div className={className.join(' ')}>
        {
          sortable && sortingEnabled &&
            connectDragSource(
              <div className="ItemRow__handle">
                <i className="icon--hamburger" />
              </div>
            )
        }
        <Link to={`${url}/edit`} className="ItemRow__item">
          <div className="ItemRow__item__inner">
            {
              !item.attributes.is_valid &&
                <div className="ItemRow__invalid-tag" />
            }
            {
              imageFields.length > 0 &&
                <div className="ItemRow__item__image">
                  {
                    hasPreviewImage(image) ?
                      <img
                        src={imageUrl(image, { w: 70, h: 70, mode: 'crop' })}
                        alt={title || this.t('item.untitled')}
                      />
                      :
                      <div className="ItemRow__item__image__placeholder" />
                  }
                </div>
            }
            <div className="ItemRow__item__content">
              <div className="ItemRow__item__title">
                {title || this.t('item.untitled')}
              </div>
            </div>
          </div>
        </Link>
      </div>
    ))
  }
}

ItemRow.propTypes = {
  itemType: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  locales: PropTypes.array.isRequired,
  titleField: PropTypes.object,
  imageFields: PropTypes.array,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  onDrag: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDropCancel: PropTypes.func.isRequired,
  sortingEnabled: PropTypes.bool,
}

const applyDragSource = dragSource(
  'ItemRow',
  {
    canDrag(props) {
      return props.itemType.attributes.sortable && props.sortingEnabled
    },

    beginDrag(props) {
      return {
        index: props.index,
      }
    },

    endDrag(props) {
      props.onDrop(props.item)
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
  'ItemRow',
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

export default applyDragSource(applyDropTarget(ItemRow))
