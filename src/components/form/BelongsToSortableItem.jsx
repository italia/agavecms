import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import {
  DragSource as dragSource,
  DropTarget as dropTarget,
} from 'react-dnd'
import { handleHorizontalHover } from 'utils/hover'

class BelongsToSortableItem extends Component {
  handleMouseDown(event) {
    // important! as react-select preventsDefault on mouseDown event, preventing also dragging
    event.stopPropagation()
  }

  render() {
    const { isDragging, connectDragSource, connectDropTarget, children } = this.props
    const opacity = isDragging ? 0 : 1

    return connectDropTarget(connectDragSource(
      <span
        style={{ opacity }}
        onMouseDown={this.handleMouseDown.bind(this)}
      >
        {children}
      </span>
    ))
  }
}

BelongsToSortableItem.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDropCancel: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  index: PropTypes.number,
  children: PropTypes.element.isRequired,
}

const applyDragSource = dragSource(
  (props) => props.dropTargetName,
  {
    canDrag(props) {
      return props.sortable
    },

    beginDrag(props) {
      return {
        index: props.index,
      }
    },

    endDrag(props) {
      props.onDrop()
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

export default applyDragSource(applyDropTarget(BelongsToSortableItem))
