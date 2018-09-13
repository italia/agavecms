import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import { canPerformActionOnItemType } from 'utils/storeQueries'
import SplitPane from 'react-split-pane'
import Spinner from 'components/sub/Spinner'
import ItemsList from 'components/sub/ItemsList'
import ItemsTree from 'components/sub/ItemsTree'

class Items extends Component {
  render() {
    const { itemType, hasReadPermission } = this.props

    if (!hasReadPermission) {
      return (
        <div className="permission-denied">
          <div className="permission-denied__inner">
            <div className="permission-denied__icon">
              <i className="icon--blocked" />
            </div>
            <div className="permission-denied__title">
              {this.t('permissionDenied.title')}
            </div>
            <div className="permission-denied__subtitle">
              {this.t('permissionDenied.subtitle')}
            </div>
          </div>
        </div>
      )
    }

    if (!itemType) {
      return <Spinner size={80} />
    }

    if (itemType.attributes.singleton) {
      return (
        <div>
          {this.props.children}
        </div>
      )
    }

    if (itemType.attributes.tree) {
      return (
        <SplitPane minSize={300} defaultSize={450} split="vertical">
          <div>
            <ItemsTree {...this.props} />
          </div>
          <div>
            {this.props.children}
          </div>
        </SplitPane>
      )
    }

    return (
      <SplitPane minSize={300} defaultSize={400} split="vertical" className="Items">
        <div>
          <ItemsList {...this.props} />
        </div>
        <div>
          {this.props.children}
        </div>
      </SplitPane>
    )
  }
}

Items.propTypes = {
  itemType: PropTypes.object,
  children: PropTypes.element,
  hasReadPermission: PropTypes.bool,
}

function mapStateToProps(state, props) {
  const itemType = state.itemTypes[props.params.itemTypeId]
  const hasReadPermission = canPerformActionOnItemType(state, 'read', props.params.itemTypeId)

  return { itemType, hasReadPermission }
}

export default connect(mapStateToProps)(Items)
