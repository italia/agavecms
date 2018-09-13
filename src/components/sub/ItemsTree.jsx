import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import Tree from 'components/sub/InnerItemsTree'
import cloneDeep from 'deep-clone'
import {
  getItemsForQuery,
  getTitleFieldForItemType,
  canPerformActionOnItemType,
} from 'utils/storeQueries'
import { update as updateItem } from 'actions/items'
import { alert, notice } from 'actions/notifications'
import { fetchPage as getItemsPage, invalidate } from 'actions/itemCollections'
import Link from 'components/sub/Link'
import Spinner from 'components/sub/Spinner'

class ItemsTree extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pendingMovement: null,
      disableUpdate: false,
    }
  }

  componentDidMount() {
    const { query } = this.props

    this.props.dispatch(getItemsPage({ query }))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPristine && !this.state.disableUpdate) {
      this.props.dispatch(getItemsPage({ query: nextProps.query }))
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextState.disableUpdate) {
      return false
    }

    return super.shouldComponentUpdate(nextProps, nextState, nextContext)
  }

  handleDrag(draggedId, overId, asChild) {
    this.setState({
      pendingMovement: { draggedId, overId, asChild },
    })
  }

  handleDrop() {
    if (!this.state.pendingMovement) {
      return
    }

    const { dispatch, itemType, query } = this.props
    const { element } = this.buildModifiedItem(false)

    new Promise((resolve) => {
      this.setState({ disableUpdate: true }, resolve)
    })
      .then(() => {
        return dispatch(updateItem({ id: element.id, data: element }))
      })
      .then(() => {
        return dispatch(invalidate({ itemTypeId: itemType.id }))
      })
      .then(() => {
        return this.props.dispatch(getItemsPage({ query }))
      })
      .then(() => {
        dispatch(notice(this.t('editor.item.reorder.success')))
        this.setState({ pendingMovement: null, disableUpdate: false })
      })
      .catch(() => {
        dispatch(alert(this.t('editor.item.reorder.failure')))
        this.setState({ pendingMovement: null, disableUpdate: false })
      })
  }

  handleDropCancel() {
    this.setState({ pendingMovement: null })
  }

  buildModifiedItem(pending) {
    const { items } = this.props
    const { draggedId, overId, asChild } = this.state.pendingMovement
    const index = items.findIndex(i => i.id === draggedId)
    const draggedElement = cloneDeep(items[index])

    delete draggedElement.attributes.updated_at
    delete draggedElement.attributes.is_valid
    delete draggedElement.relationships

    if (asChild) {
      draggedElement.attributes.position = pending ? -0.5 : 0
      draggedElement.attributes.parent_id = overId
    } else {
      const overElement = items.find(i => i.id === overId)
      draggedElement.attributes.position = overElement.attributes.position + (pending ? 0.5 : 1)
      draggedElement.attributes.parent_id = overElement.attributes.parent_id
    }

    return { element: draggedElement, index }
  }

  renderItems() {
    const { items, elementProps, hasUpdatePermission } = this.props
    let sortedItems = items

    if (this.state.pendingMovement) {
      const { element, index } = this.buildModifiedItem(true)
      sortedItems = items.slice()
      sortedItems[index] = element
    }

    const rootElements = sortedItems
      .filter((i) => !i.attributes.parent_id)
      .sort((a, b) => a.attributes.position - b.attributes.position)

    return (
      <Tree
        items={sortedItems}
        elementProps={elementProps}
        elements={rootElements}
        parentId={null}
        onDrag={this.handleDrag.bind(this)}
        onDrop={this.handleDrop.bind(this)}
        onDropCancel={this.handleDropCancel.bind(this)}
        sortingEnabled={hasUpdatePermission}
      />
    )
  }

  renderBlankSlate() {
    const { itemType, hasCreatePermission } = this.props

    return (
      <div className="Items__blank-slate">
        <div className="Items__blank-slate__inner">
          <div className="Items__blank-slate__title">
            {this.t('editor.item.noItems.title')}
          </div>
          {
            hasCreatePermission &&
              <div className="Items__blank-slate__description">
                {this.t('editor.item.noItems.description', { name: itemType.attributes.name })}
              </div>
          }
        </div>
        {
          hasCreatePermission &&
            <div className="Items__blank-slate__arrow" />
        }
      </div>
    )
  }

  render() {
    const {
      totalEntries,
      isFetching,
      itemType,
      hasCreatePermission,
      hasUpdatePermission,
    } = this.props

    const className = ['ItemsTree']

    if (!hasUpdatePermission) {
      className.push('is-dnd-disabled')
    }

    return (
      <div className={className.join(' ')}>
        <div className="ItemsTree__inner">
          {
            totalEntries === 0 ?
              this.renderBlankSlate() :
              this.renderItems()
          }
          {
            isFetching &&
              <Spinner size={80} />
          }
        </div>
        {
          hasCreatePermission &&
            <Link
              className="Items__button"
              to={`/editor/item_types/${itemType.id}/items/new`}
              data-test-hook="add-item"
            >
              <i className="icon--add" />
            </Link>
        }
      </div>
    )
  }
}

ItemsTree.propTypes = {
  dispatch: PropTypes.func.isRequired,
  itemType: PropTypes.object,
  items: PropTypes.array,
  params: PropTypes.object.isRequired,
  isFetching: PropTypes.bool,
  isComplete: PropTypes.bool,
  isPristine: PropTypes.bool,
  location: PropTypes.object,
  children: PropTypes.element,
  totalEntries: PropTypes.number,
  hasCreatePermission: PropTypes.bool,
  hasUpdatePermission: PropTypes.bool,
  query: PropTypes.object,
  elementProps: PropTypes.object,
}

function mapStateToProps(state, props) {
  const itemType = state.itemTypes[props.params.itemTypeId]

  const titleField = getTitleFieldForItemType(state, itemType)
  const locales = state.site ? state.site.attributes.locales : []
  const hasUpdatePermission = canPerformActionOnItemType(state, 'update', props.params.itemTypeId)

  const hasCreatePermission = canPerformActionOnItemType(state, 'create', props.params.itemTypeId)

  const query = {
    'filter[type]': props.params.itemTypeId,
    'page[limit]': 100,
  }

  const {
    items,
    isComplete,
    isFetching,
    isPristine,
    totalEntries,
  } = getItemsForQuery(state, query)

  return {
    hasCreatePermission,
    items,
    isComplete,
    isFetching,
    isPristine,
    totalEntries,
    itemType,
    query,
    hasUpdatePermission,
    elementProps: {
      titleField,
      locales,
      itemType,
    },
  }
}

export default connect(mapStateToProps)(ItemsTree)
