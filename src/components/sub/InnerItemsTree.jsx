import React, { PropTypes } from 'react'
import { DropTarget as dropTarget } from 'react-dnd'
import Element from 'components/sub/ItemsTreeElement'
import Component from 'components/BaseComponent'

class InnerItemsTree extends Component {
  renderElement(element) {
    const {
      items,
      onDrag,
      onDrop,
      onDropCancel,
      elementProps,
      sortingEnabled,
    } = this.props

    return (
      <Element
        key={element.id}
        items={items}
        element={element}
        onDrag={onDrag}
        onDrop={onDrop}
        onDropCancel={onDropCancel}
        sortingEnabled={sortingEnabled}
        {...elementProps}
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
            <div className="ItemTreeRow__children__hover" />
          )
        }
        <ul className={cssClasses.join(' ')}>
          {elements.map(this.renderElement.bind(this))}
        </ul>
      </div>
    )
  }
}

InnerItemsTree.propTypes = {
  items: PropTypes.array,
  elements: PropTypes.array,
  connectDropTarget: PropTypes.func,
  parentId: PropTypes.string,
  onDrag: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDropCancel: PropTypes.func.isRequired,
  elementProps: PropTypes.object,
  sortingEnabled: PropTypes.bool,
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

export default applyDropTarget(InnerItemsTree)
