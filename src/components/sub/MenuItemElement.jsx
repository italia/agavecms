import React, { PropTypes } from 'react'
import {
  DragSource as dragSource,
  DropTarget as dropTarget,
} from 'react-dnd'
import Tree from 'components/sub/MenuItemTree'
import Link from 'components/sub/Link'
import { FormattedMessage } from 'react-intl'
import Component from 'components/BaseComponent'

class MenuItemElement extends Component {
  handleEditClick(menuItem, e) {
    e.preventDefault()
    this.props.onEdit(menuItem)
  }

  handleDestroyClick(menuItem, e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.onDestroy(menuItem)
  }

  render() {
    const {
      itemTypes,
      menuItems,
      element,
      connectDragPreview,
      connectDropTarget,
      connectDragSource,
      onDrag,
      onDrop,
      onDropCancel,
      isDragging,
      isOver,
      onEdit,
      onDestroy,
    } = this.props
    let itemType = null

    if (element.relationships.item_type.data) {
      itemType = itemTypes
        .find((ct) => ct.id === element.relationships.item_type.data.id)
    }

    const elements = menuItems
      .filter((sub) => {
        return sub.relationships.parent.data &&
          sub.relationships.parent.data.id === element.id
      })
      .sort((a, b) => a.attributes.position - b.attributes.position)

    const label = element.attributes.label

    const className = ['MenuItems__item']

    if (isOver) {
      className.push('is-hover')
    }

    return connectDragPreview(
      <li
        className={className.join(' ')}
        key={element.id}
      >
        {
          connectDragSource(
            <div className="MenuItems__item__handle">
              <i className="icon--hamburger" />
            </div>
          )
        }
        {
          isDragging ?
            <div className="MenuItems__item__tick" />
            :
            <div>
              <div className="MenuItems__item__inner">
                <div className="MenuItems__item__content">
                  <div className="MenuItems__item__title">
                    {label}
                  </div>
                  {
                    itemType &&
                      <Link
                        className="MenuItems__item__content-type"
                        to={`/admin/item_types/${itemType.id}`}
                      >
                        {itemType.attributes.name}
                      </Link>
                  }
                  <div
                    className="MenuItems__item__actions"
                  >
                    <a
                      href="#"
                      className="button button--micro"
                      onClick={this.handleEditClick.bind(this, element)}
                    >
                      <FormattedMessage id="menuitem.fieldrow.edit" />
                    </a>
                    {' '}
                    <a
                      href="#"
                      className="button button--micro button--alert"
                      onClick={this.handleDestroyClick.bind(this, element)}
                    >
                      <FormattedMessage id="menuitem.fieldrow.delete" />
                    </a>
                  </div>
                </div>
              </div>
              <Tree
                itemTypes={itemTypes}
                menuItems={menuItems}
                elements={elements}
                parentId={element.id}
                onDrag={onDrag}
                onDrop={onDrop}
                onDropCancel={onDropCancel}
                onEdit={onEdit}
                onDestroy={onDestroy}
              />
              {
                connectDropTarget(
                  <div className="MenuItems__item__hover" />
                )
              }
            </div>
        }
      </li>
    )
  }
}

MenuItemElement.propTypes = {
  itemTypes: PropTypes.array,
  menuItems: PropTypes.array,
  element: PropTypes.object,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  isDragging: PropTypes.bool,
  isOver: PropTypes.bool,
  onDrop: PropTypes.func.isRequired,
  onDropCancel: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDestroy: PropTypes.func.isRequired,
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
      const parentId = element.relationships.parent.data &&
        element.relationships.parent.data.id

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
    beginDrag(props) {
      const { element } = props
      const parentId = element.relationships.parent.data &&
        element.relationships.parent.data.id

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
