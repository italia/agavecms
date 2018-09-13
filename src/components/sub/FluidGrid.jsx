import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import sizeMe from 'react-sizeme'

function calculateFluidGrid(gridWidth, idealRowHeight, gutter, items) {
  const itemLength = items.length
  const rowHeightArray = []
  const normWidths = items.map(item => (
    item.width ?
      item.width * (idealRowHeight / item.height) :
      idealRowHeight
  ))
  const itemsSize = new Array(items.length)
  let rowFirstItem = 0
  let rowWidth = 0
  let rowMaxWidth = 0
  let rowGutterWidth = 0
  let rowHeight = 0
  let rowHeightTotal = 0
  let rowRatio = 0
  let itemWidth = 0
  let itemIsLast = false
  let i = 0
  let x = 0

  for (; i < itemLength; i += 1) {
    rowWidth += normWidths[i]
    if (normWidths[i] > 0) {
      rowGutterWidth += gutter
    }
    itemIsLast = i === itemLength - 1

    if (rowWidth + rowGutterWidth >= gridWidth || itemIsLast) {
      // Since gutters always have the same width (regardless of `rowHeight`), we
      // need to exclude them from the calculations
      rowMaxWidth = gridWidth - rowGutterWidth

      if (rowMaxWidth / rowWidth > 1 && itemIsLast) {
        // Use a different height for orphan elements
        rowHeight = rowHeightArray.length > 0 ?
          rowHeightTotal / rowHeightArray.length :
          idealRowHeight
        rowRatio = rowHeight / idealRowHeight
      } else {
        rowRatio = Math.min(rowMaxWidth / rowWidth, 1)
        rowHeight = Math.floor(rowRatio * idealRowHeight)
      }

      rowHeightArray.push(rowHeight)
      rowHeightTotal += rowHeight

      for (x = rowFirstItem; x <= i; x += 1) {
        itemWidth = Math.floor(rowRatio * normWidths[x])
        itemsSize[x] = { width: itemWidth, height: rowHeight }
      }

      // Reset row variables
      rowWidth = 0
      rowGutterWidth = 0
      rowFirstItem = i + 1
    }
  }

  return itemsSize
}

class FluidGrid extends Component {
  render() {
    const { size, sizes, rowHeight, gutter, children } = this.props

    if (!size.width) {
      return <div />
    }

    const itemSizes = calculateFluidGrid(size.width, rowHeight, gutter, sizes)

    let i = -1
    const augmentedChildren = React.Children.map(children, (child) => {
      if (!child) {
        return null
      }

      i += 1
      return (
        <div className="FluidGrid__item" style={itemSizes[i]}>
          {child}
        </div>
      )
    })

    return (
      <div className="FluidGrid">
        {augmentedChildren}
      </div>
    )
  }
}

FluidGrid.propTypes = {
  rowHeight: PropTypes.number.isRequired,
  gutter: PropTypes.number.isRequired,
  size: React.PropTypes.shape({
    width: React.PropTypes.number,
    height: React.PropTypes.number,
  }),
  sizes: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      width: React.PropTypes.number,
      height: React.PropTypes.number,
    })
  ),
  children: PropTypes.node.isRequired,
}

export default sizeMe({ refreshRate: 100 })(FluidGrid)
