import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import { reset } from 'redux-form'
import { fetch as getItem } from 'actions/items'
import { fetchById as getItemsById } from 'actions/itemCollections'
import { alert, notice } from 'actions/notifications'
import ItemForm from 'components/sub/ItemForm'
import {
  getFieldsForItemType,
  canPerformActionOnItemType,
} from 'utils/storeQueries'
import Spinner from 'components/sub/Spinner'
import deepEqual from 'deep-equal'
import generateEmptyItem from 'utils/generateEmptyItem'
import persistItems from 'utils/persistItems'

class EditItem extends Component {
  componentDidMount() {
    const { dispatch, params: { itemId }, deepItemIds } = this.props

    if (itemId) {
      dispatch(getItem({ id: itemId }))
    }

    if (deepItemIds && deepItemIds.length > 0) {
      dispatch(getItemsById({ ids: deepItemIds }))
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, params: { itemId }, deepItemIds } = this.props

    if (nextProps.params.itemId && nextProps.params.itemId !== itemId) {
      dispatch(getItem({ id: nextProps.params.itemId }))
    }

    if (nextProps.deepItemIds && !deepEqual(nextProps.deepItemIds, deepItemIds)) {
      if (nextProps.deepItemIds.length > 0) {
        dispatch(getItemsById({ ids: nextProps.deepItemIds }))
      }
    }
  }

  handleSubmit(items) {
    const { dispatch, itemType, form } = this.props

    const { item } = items.find(({ key }) => !key)
    const justCreated = !item.id
    const type = justCreated ? 'create' : 'update'

    return persistItems(items, dispatch)
    .then((newItem) => {
      dispatch(notice(this.t(`editor.item.${type}.success`)))

      if (justCreated) {
        dispatch(reset(form))
        this.pushRoute(`/editor/item_types/${itemType.id}/items/${newItem.id}/edit`)
      }
    })
    .catch((error) => {
      /* eslint-disable dot-notation */
      if (error.errors['_error']) {
        dispatch(alert(this.t(`genericError.${error.errors['_error']}`)))
      } else {
        dispatch(alert(this.t(`editor.item.${type}.failure`)))
      }
      /* eslint-enable dot-notation */

      return Promise.reject(error)
    })
  }

  renderForm() {
    const {
      form,
      item,
      locales,
      itemType,
      fields,
      deepItems,
      hasUpdatePermission,
    } = this.props

    return (
      <ItemForm
        disabled={!hasUpdatePermission}
        onSubmit={this.handleSubmit.bind(this)}
        form={form}
        locales={locales}
        item={item}
        itemType={itemType}
        fields={fields}
        deepItems={deepItems}
      />
    )
  }

  renderLoading() {
    return (
      <div className="Page__inner">
        <Spinner size={80} />
      </div>
    )
  }

  render() {
    const { item, deepItems, itemType, locales } = this.props

    return item && deepItems && deepItems.every(x => x) && itemType && locales ?
      this.renderForm() :
      this.renderLoading()
  }
}

EditItem.propTypes = {
  dispatch: PropTypes.func.isRequired,
  locales: PropTypes.array,
  item: PropTypes.object,
  itemType: PropTypes.object,
  fields: PropTypes.array,
  params: PropTypes.object.isRequired,
  deepItemIds: PropTypes.array,
  deepItems: PropTypes.array,
  form: PropTypes.string,
  lastEditor: PropTypes.string,
  hasUpdatePermission: PropTypes.bool,
}

function mapStateToProps(state, props) {
  const itemType = state.itemTypes[props.params.itemTypeId]
  const fields = getFieldsForItemType(state, itemType)
  const locales = state.site ? state.site.attributes.locales : null
  const hasUpdatePermission = canPerformActionOnItemType(state, 'update', props.params.itemTypeId)

  const item = props.params.itemId ?
    state.items[props.params.itemId] :
    generateEmptyItem(locales, fields, itemType)

  const linksFields = fields.filter(f => f.attributes.field_type === 'rich_text')

  const deepItemIds = item &&
    [].concat(...linksFields.map((field) => {
      const value = item.attributes[field.attributes.api_key]

      if (!field.attributes.localized) {
        return value || []
      }

      return [].concat(...locales.map(locale => value[locale] || []))
    }))

  const deepItems = deepItemIds &&
    deepItemIds.map(id => state.items[id])

  const form = `itemForm-${itemType.id}-${props.params.itemId || 'new'}`

  return {
    form,
    item,
    fields,
    itemType,
    locales,
    deepItemIds,
    deepItems,
    hasUpdatePermission,
  }
}

export default connect(mapStateToProps)(EditItem)

