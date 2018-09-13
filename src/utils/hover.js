import ReactDOM from 'react-dom'

export function handleVerticalHover(props, monitor, component) {
  const { index: dragIndex } = monitor.getItem()
  const { index: hoverIndex } = props

  const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect()
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
  const clientOffset = monitor.getClientOffset()
  const hoverClientY = clientOffset.y - hoverBoundingRect.top

  if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    return
  }

  if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    return
  }

  props.onDrag({
    fromIndex: dragIndex,
    toIndex: hoverIndex,
  })
}

export function handleHorizontalHover(props, monitor, component) {
  const { index: dragIndex } = monitor.getItem()
  const { index: hoverIndex } = props

  const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect()
  const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
  const clientOffset = monitor.getClientOffset()
  const hoverClientX = clientOffset.x - hoverBoundingRect.left
  if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
    return
  }

  if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
    return
  }

  props.onDrag({
    fromIndex: dragIndex,
    toIndex: hoverIndex,
  })
}
