import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import {
  getItemsForQuery,
  getTitleFieldForItemType,
  getImageFieldsForItemType,
  canPerformActionOnItemType,
} from 'utils/storeQueries'
import { setItemCollectionSearchTerm } from 'actions/ui'
import Link from 'components/sub/Link'
import ItemRow from 'components/sub/ItemRow'
import InfiniteScroll from 'components/sub/InfiniteScroll'
import { update as updateItem } from 'actions/items'
import { fetchPage as getItemsPage } from 'actions/itemCollections'
import debounce from 'debounce'
import switchElements from 'utils/switchElements'
import { alert, notice } from 'actions/notifications'
import Spinner from 'components/sub/Spinner'

class ItemsList extends Component {
  constructor(props) {
    super(props)

    this.applySearch = debounce(
      this.applySearch.bind(this),
      500
    )

    this.state = {
      pendingMovement: null,
      disableUpdate: false,
      searchTerm: props.location.query.term,
    }
  }

  componentDidMount() {
    const { items } = this.props

    if (items.length === 0) {
      this.fetchPage(this.props)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPristine && !this.state.disableUpdate) {
      this.fetchPage(nextProps)
    }

    if (nextProps.term !== this.props.term) {
      this.setState({ searchTerm: nextProps.term })
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextState.disableUpdate) {
      return false
    }

    return super.shouldComponentUpdate(nextProps, nextState, nextContext)
  }

  fetchPage(props) {
    const { query } = props
    return this.props.dispatch(getItemsPage({ query }))
  }

  handleSearchTermChange(e) {
    this.setState({ searchTerm: e.target.value })
    this.applySearch()
  }

  applySearch() {
    const { itemTypeId } = this.props.params
    const { dispatch } = this.props
    dispatch(setItemCollectionSearchTerm({ itemTypeId, term: this.state.searchTerm }))
  }

  handleDrop(item) {
    if (!this.state.pendingMovement) {
      return
    }

    const { items, dispatch } = this.props
    const { toIndex } = this.state.pendingMovement
    const { position } = items[toIndex].attributes
    const { id, type, attributes } = item
    const newAttributes = Object.assign(
      {}, attributes,
      { position }
    )

    delete newAttributes.updated_at
    delete newAttributes.is_valid

    new Promise((resolve) => {
      this.setState({ disableUpdate: true }, resolve)
    })
      .then(() => {
        return dispatch(updateItem({
          id, data: { id, type, attributes: newAttributes },
        }))
      })
      .then(() => {
        return this.fetchPage(this.props)
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

  handleDrag(pendingMovement) {
    this.setState({ pendingMovement })
  }

  handleDropCancel() {
    this.setState({ pendingMovement: null })
  }

  handleLoadMore() {
    this.fetchPage(this.props)
  }

  findItemIndex(id) {
    const { items } = this.props
    const item = items.find(c => c.id === id)
    return items.indexOf(item)
  }

  renderItem(item, index) {
    const {
      locales,
      titleField,
      imageFields,
      itemType,
      hasUpdatePermission,
    } = this.props

    return (
      <ItemRow
        key={item.id}
        index={index}
        item={item}
        locales={locales}
        itemType={itemType}
        titleField={titleField}
        imageFields={imageFields}
        onDrag={this.handleDrag.bind(this)}
        onDrop={this.handleDrop.bind(this)}
        onDropCancel={this.handleDropCancel.bind(this)}
        sortingEnabled={!this.state.searchTerm && hasUpdatePermission}
      />
    )
  }

  renderItems() {
    const { itemType, items } = this.props
    const { pendingMovement } = this.state
    let sortedItems = items

    if (pendingMovement) {
      const { fromIndex, toIndex } = pendingMovement
      sortedItems = switchElements(items, fromIndex, toIndex)
    }

    return (
      <InfiniteScroll
        inner
        className="Items__items Items__items--no-absolute"
        key={itemType.id}
        onLoadMore={this.handleLoadMore.bind(this)}
        active={!this.props.isFetching && !this.props.isComplete}
      >
        {sortedItems.map(this.renderItem.bind(this))}
      </InfiniteScroll>
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
    const { itemType, totalEntries, hasCreatePermission } = this.props

    return (
      <div className="Items ItemsList">
        {
          (totalEntries > 10 || !!this.state.searchTerm) &&
            <div className="Items__search">
              <input
                type="text"
                value={this.state.searchTerm}
                placeholder={this.t('newItem.filter')}
                onChange={this.handleSearchTermChange.bind(this)}
              />
            </div>
        }
        {
          totalEntries === 0 ?
            this.renderBlankSlate() :
            this.renderItems()
        }
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
        {
          this.props.isFetching &&
            <Spinner size={80} />
        }
      </div>
    )
  }
}

ItemsList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  itemType: PropTypes.object,
  items: PropTypes.array,
  locales: PropTypes.array,
  params: PropTypes.object.isRequired,
  titleField: PropTypes.object,
  imageFields: PropTypes.array,
  isFetching: PropTypes.bool,
  isComplete: PropTypes.bool,
  isPristine: PropTypes.bool,
  location: PropTypes.object,
  children: PropTypes.element,
  totalEntries: PropTypes.number,
  term: PropTypes.string,
  hasCreatePermission: PropTypes.bool,
  hasUpdatePermission: PropTypes.bool,
}

function mapStateToProps(state, props) {
  const itemType = state.itemTypes[props.params.itemTypeId]
  const titleField = getTitleFieldForItemType(state, itemType)
  const imageFields = getImageFieldsForItemType(state, itemType)
  const locales = state.site ? state.site.attributes.locales : []
  const term = state.ui.itemCollectionSearchTerm[props.params.itemTypeId]

  const hasCreatePermission = canPerformActionOnItemType(state, 'create', props.params.itemTypeId)
  const hasUpdatePermission = canPerformActionOnItemType(state, 'update', props.params.itemTypeId)

  const query = {
    'filter[type]': props.params.itemTypeId,
    'filter[query]': term,
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
    hasUpdatePermission,
    items,
    isComplete,
    isFetching,
    isPristine,
    totalEntries,
    itemType,
    titleField,
    imageFields,
    locales,
    query,
    term,
  }
}

export default connect(mapStateToProps)(ItemsList)
