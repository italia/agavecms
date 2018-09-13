import React, { PropTypes } from 'react'
import { DropTarget as dropTarget } from 'react-dnd'
import Element from 'components/sub/MenuItemElement'
import Component from 'components/BaseComponent'

class MenuItemTree extends Component {
  renderElement(element) {
    const {
      menuItems,
      itemTypes,
      onDrag,
      onDrop,
      onDropCancel,
      onEdit,
      onDestroy,
    } = this.props

    return (
      <Element
        key={element.id}
        menuItems={menuItems}
        itemTypes={itemTypes}
        element={element}
        onDrag={onDrag}
        onDrop={onDrop}
        onDropCancel={onDropCancel}
        onEdit={onEdit}
        onDestroy={onDestroy}
      />
    )
  }

  render() {
    const { elements, connectDropTarget } = this.props
    const cssClasses = ['MenuItems__item__children']

    return (
      <div>
        {
          connectDropTarget(
            <div className="MenuItems__item__children__hover" />
          )
        }
        <ul className={cssClasses.join(' ')}>
          {elements.map(this.renderElement.bind(this))}
        </ul>
      </div>
    )
  }
}

MenuItemTree.propTypes = {
  itemTypes: PropTypes.array,
  menuItems: PropTypes.array,
  elements: PropTypes.array,
  connectDropTarget: PropTypes.func,
  parentId: PropTypes.string,
  onDrag: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDropCancel: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDestroy: PropTypes.func.isRequired,
}

const applyDropTarget = dropTarget(
  'MenuItem',
  {
    drop() {},

    hover(props, monitor) {
      const { id: draggedId } = monitor.getItem()

      if (!monitor.isOver({ shallow: true })) {
        return
      }

      props.onDrag(draggedId, props.parentId, true)
    },
  },
  (connect) => ({
    connectDropTarget: connect.dropTarget(),
  })
)

export default applyDropTarget(MenuItemTree)
