import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import { fetchById as getItemsById } from 'actions/itemCollections'
import {
  getTitleFieldForItemType,
  getImageFieldsForItemType,
  getFieldsForItemType,
} from 'utils/storeQueries'
import Modal from 'components/sub/Modal'
import ItemForm from 'components/sub/ItemForm'
import generateEmptyItem from 'utils/generateEmptyItem'
import EmbedsManyRow from 'components/form/EmbedsManyRow'
import switchElements from 'utils/switchElements'
import ChooseItemTypeButton from 'components/sub/ChooseItemTypeButton'
import persistItems from 'utils/persistItems'
import { alert } from 'actions/notifications'
import deepEqual from 'deep-equal'

class EmbedsManyInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: null,
      pendingMovement: null,
    }
  }

  componentDidMount() {
    const { dispatch, deepItemIds } = this.props

    if (deepItemIds.length > 0) {
      dispatch(getItemsById({ ids: deepItemIds }))
    }
  }

  componentWillReceiveProps(props) {
    const { dispatch, value: itemIds, deepItemIds } = props

    let ids = []

    if (itemIds && itemIds.length > 0) {
      ids = [].concat(ids, itemIds)
    }

    if (!deepEqual(deepItemIds, this.props.deepItemIds)) {
      ids = [].concat(ids, deepItemIds)
    }

    if (ids.length > 0) {
      dispatch(getItemsById({ ids }))
    }
  }

  handleDrag(pendingMovement) {
    this.setState({ pendingMovement })
  }

  handleDrop() {
    if (!this.state.pendingMovement) {
      return
    }

    const { fromIndex, toIndex } = this.state.pendingMovement
    const newValue = switchElements(this.props.value, fromIndex, toIndex)
    this.setState({ pendingMovement: null })
    this.props.onBlur(newValue)
  }

  handleDropCancel() {
    this.setState({ pendingMovement: null })
  }

  handleItemEdit(item, itemTypeId) {
    this.setState({
      activeItem: item,
      activeItemTypeId: itemTypeId,
    })
  }

  handleItemDestroy(index) {
    if (!confirm(this.t('messages.areyousure'))) {
      return
    }

    const newValue = this.props.value.slice()
    newValue.splice(index, 1)
    this.props.onBlur(newValue)
  }

  handleItemNew(itemType, fields) {
    const { locales } = this.props
    const item = generateEmptyItem(locales, fields, itemType)
    this.setState({
      activeItem: item,
      activeItemTypeId: itemType.id,
    })
  }

  handleSubmit(items) {
    const { dispatch } = this.props
    const { item } = items.find(({ key }) => !key)
    const justCreated = !item.id
    const type = justCreated ? 'create' : 'update'

    return persistItems(items, dispatch)
    .then((newItem) => {
      const value = this.props.value || []
      if (!value.includes(newItem.id)) {
        const newValue = [].concat(value, newItem.id)
        this.props.onBlur(newValue)
      }
      this.setState({ activeItem: null })
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

  handleEditClose() {
    this.setState({ activeItem: null })
  }

  renderItem(sortingEnabled, item, index) {
    const { disabled, locales, itemTypeIds, itemTypes, id, needsToShowImage } = this.props
    const itemTypeId = item.relationships.item_type.data.id
    const { itemType, titleField, imageFields, fields } = itemTypes[itemTypeId]

    return (
      <EmbedsManyRow
        disabled={disabled}
        key={item.id}
        dndType={id}
        onEdit={this.handleItemEdit.bind(this, item, itemTypeId)}
        onDestroy={this.handleItemDestroy.bind(this, index)}
        locales={locales}
        showImage={needsToShowImage}
        itemTypeName={itemTypeIds.length > 1 ? itemType.attributes.name : null}
        titleField={titleField}
        imageFields={imageFields}
        fields={fields}
        index={index}
        item={item}
        onDrag={this.handleDrag.bind(this)}
        onDrop={this.handleDrop.bind(this)}
        onDropCancel={this.handleDropCancel.bind(this)}
        sortingEnabled={!disabled && sortingEnabled}
      />
    )
  }

  renderModal() {
    const { itemTypes, locales, disabled, deepItems } = this.props
    const { activeItem, activeItemTypeId } = this.state
    const { itemType, fields } = itemTypes[activeItemTypeId]

    const name = itemType.attributes.name
    const modalTitle = activeItem.id ?
      this.t('embedsManyInput.modal.editTitle', { name }) :
      this.t('embedsManyInput.modal.addTitle', { name })

    const form = `itemForm-${itemType.id}-${activeItem.id || 'new'}`

    return (
      <Modal
        freeContent
        onClose={this.handleEditClose.bind(this)}
        title={modalTitle}
      >
        <ItemForm
          isModal
          onSubmit={this.handleSubmit.bind(this)}
          form={form}
          locales={locales}
          item={activeItem}
          itemType={itemType}
          fields={fields}
          disabled={disabled}
          deepItems={deepItems[activeItem.id]}
        />
      </Modal>
    )
  }

  render() {
    const { limit, items, itemTypeIds, disabled } = this.props

    let sortedItems = items

    if (this.state.pendingMovement) {
      const { fromIndex, toIndex } = this.state.pendingMovement
      sortedItems = switchElements(items, fromIndex, toIndex)
    }

    const sortingEnabled = sortedItems.length > 1

    return (
      <div>
        {sortedItems.map(this.renderItem.bind(this, sortingEnabled))}
        {
          (!limit || sortedItems.length < limit) && !disabled &&
            <ChooseItemTypeButton
              intlLabel="embedsManyInput.add"
              itemTypeIds={itemTypeIds}
              onSelect={this.handleItemNew.bind(this)}
              menuItem={false}
            />
        }
        {
          this.state.activeItem &&
            this.renderModal()
        }
      </div>
    )
  }
}

EmbedsManyInput.propTypes = {
  id: PropTypes.string.isRequired,
  itemTypeIds: PropTypes.array.isRequired,
  value: PropTypes.array,
  onBlur: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
  itemTypes: PropTypes.object,
  locales: PropTypes.array,
  items: PropTypes.array,
  limit: PropTypes.number,
  needsToShowImage: PropTypes.bool,
  disabled: PropTypes.bool,
  deepItems: PropTypes.array,
  deepItemIds: PropTypes.array,
}

function mapStateToProps(state, props) {
  const itemTypes = props.itemTypeIds.reduce((acc, id) => {
    const itemType = state.itemTypes[id]
    const titleField = getTitleFieldForItemType(state, itemType)
    const imageFields = getImageFieldsForItemType(state, itemType)
    const fields = getFieldsForItemType(state, itemType)
    return Object.assign(
      {}, acc,
      {
        [id]: { itemType, titleField, imageFields, fields },
      }
    )
  }, {})

  const locales = state.site ? state.site.attributes.locales : null

  const itemIds = props.value
  const items = (itemIds || []).map((id) => {
    return state.items[id]
  }).filter(x => !!x)

  let cumulativeDeepItemIds = []

  const deepItems = (items).reduce((acc, item) => {
    const itemTypeId = item.relationships.item_type.data.id
    const fields = itemTypes[itemTypeId].fields
    const linksFields = fields.filter(f => f.attributes.field_type === 'rich_text')

    const deepItemIds = [].concat(...linksFields.map((field) => {
      const value = item.attributes[field.attributes.api_key]

      if (!field.attributes.localized) {
        return value || []
      }

      return [].concat(...locales.map(locale => value[locale] || []))
    }))

    cumulativeDeepItemIds = [].concat(cumulativeDeepItemIds, deepItemIds)

    return Object.assign(
      {}, acc,
      {
        [item.id]: deepItemIds && deepItemIds.map(id => state.items[id]),
      }
    )
  }, {})

  const needsToShowImage = items.some(item => {
    const itemTypeId = item.relationships.item_type.data.id
    return !!itemTypes[itemTypeId].imageFields
  })

  return {
    itemTypes,
    deepItemIds: cumulativeDeepItemIds,
    deepItems,
    locales,
    items,
    needsToShowImage,
  }
}

export default connect(mapStateToProps)(EmbedsManyInput)
