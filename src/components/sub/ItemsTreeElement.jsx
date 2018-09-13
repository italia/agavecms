import React, { PropTypes } from 'react'
import {
  DragSource as dragSource,
  DropTarget as dropTarget,
} from 'react-dnd'
import Tree from 'components/sub/InnerItemsTree'
import Link from 'components/sub/Link'
import Component from 'components/BaseComponent'
import buildTitleFromValue from 'utils/buildTitleFromValue'
import getFieldValue from 'utils/getFieldValue'

class MenuItemElement extends Component {
  render() {
    const {
      items,
      element,
      connectDragPreview,
      connectDropTarget,
      connectDragSource,
      onDrag,
      onDrop,
      onDropCancel,
      isDragging,
      isOver,
      titleField,
      locales,
      itemType,
      sortingEnabled,
    } = this.props

    const elements = items
      .filter((sub) => {
        return sub.attributes.parent_id === element.id
      })
      .sort((a, b) => a.attributes.position - b.attributes.position)

    const title = buildTitleFromValue(
      getFieldValue(element, titleField, locales),
      titleField
    )

    const url = `/editor/item_types/${itemType.id}/items/${element.id}`

    const className = ['ItemTreeRow']

    if (!sortingEnabled) {
      className.push('is-dnd-disabled')
    }

    if (isOver) {
      className.push('is-over')
    }

    return connectDragPreview(
      <li
        className={className.join(' ')}
        key={element.id}
      >
        {
          connectDragSource(
            <div className="ItemTreeRow__handle">
              <i className="icon--hamburger" />
            </div>
          )
        }
        {
          isDragging ?
            <div className="ItemTreeRow__tick" />
            :
            <div>
              <Link
                to={`${url}/edit`}
                className="ItemTreeRow__inner"
                activeClassName="ItemTreeRow__inner--is-active"
              >
                <div className="ItemTreeRow__content">
                  <div className="ItemTreeRow__title">
                    {title}
                  </div>
                </div>
              </Link>
              <Tree
                items={items}
                elements={elements}
                parentId={element.id}
                onDrag={onDrag}
                onDrop={onDrop}
                onDropCancel={onDropCancel}
                sortingEnabled={sortingEnabled}
                elementProps={{
                  titleField,
                  locales,
                  itemType,
                }}
              />
              {
                connectDropTarget(
                  <div className="ItemTreeRow__hover" />
                )
              }
            </div>
        }
      </li>
    )
  }
}

MenuItemElement.propTypes = {
  items: PropTypes.array,
  element: PropTypes.object,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  isDragging: PropTypes.bool,
  isOver: PropTypes.bool,
  onDrop: PropTypes.func.isRequired,
  onDropCancel: PropTypes.func.isRequired,
  titleField: PropTypes.object,
  locales: PropTypes.array,
  itemType: PropTypes.object,
  sortingEnabled: PropTypes.bool,
}

const applyDropTarget = dropTarget(
  'MenuItem',
  {
    drop() {
    },

    hover(props, monitor) {
      const { id: draggedId } = monitor.getItem()

      const { element } = props

      const overId = element.id
      const parentId = element.attributes.parent_id

      if (draggedId === overId || draggedId === parentId) {
        return
      }

      if (!monitor.isOver({ shallow: true })) {
        return
      }

      props.onDrag(draggedId, overId, false)
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.canDrop(),
  })
)

const applyDragSource = dragSource(
  'MenuItem',
  {
    canDrag(props) {
      return props.sortingEnabled
    },

    beginDrag(props) {
      const { element } = props
      const parentId = element.attributes.parent_id

      return {
        id: element.id,
        parentId,
      }
    },

    endDrag(props) {
      props.onDrop()
    },

    isDragging(props, monitor) {
      return props.element.id === monitor.getItem().id
    },
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  })
)

export default applyDropTarget(applyDragSource(MenuItemElement))
