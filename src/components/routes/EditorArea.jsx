import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import ItemTypesBar from 'components/sub/ItemTypesBar'
import SplitPane from 'react-split-pane'
import { connect } from 'react-redux'

class EditorArea extends Component {
  componentDidMount() {
    if (!this.props.hasMenuItems || this.props.itemTypes.length === 0) {
      this.pushRoute('/admin')
    }

    if (this.props.itemTypes.length === 1) {
      const itemType = this.props.itemTypes[0].id
      this.pushRoute(`/editor/item_types/${itemType}/items`)
    }
  }

  render() {
    return (
      <SplitPane minSize={200} defaultSize={250} split="vertical">
        <div>
          <ItemTypesBar />
        </div>
        <div>
          {this.props.children}
        </div>
      </SplitPane>
    )
  }
}

EditorArea.propTypes = {
  children: PropTypes.element,
  isLoading: PropTypes.bool,
  hasMenuItems: PropTypes.bool,
  itemTypes: PropTypes.array,
}

function mapStateToProps(state) {
  const hasMenuItems = Object.values(state.menuItems).length > 0
  const itemTypes = Object.values(state.itemTypes)

  return { hasMenuItems, itemTypes }
}

export default connect(mapStateToProps)(EditorArea)
