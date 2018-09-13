import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { SelectInput } from 'components/form'
import { connect } from 'react-redux'
import {
  fetch as getItems,
  fetchById as getItemsById,
} from 'actions/itemCollections'
import getFieldValue from 'utils/getFieldValue'
import {
  getTitleFieldForItemType,
  getFieldsForItemType,
  getItemsForQuery,
} from 'utils/storeQueries'
import buildTitleFromValue from 'utils/buildTitleFromValue'
import SortableItem from 'components/form/BelongsToSortableItem'
import switchElements from 'utils/switchElements'
import ChooseItemTypeButton from 'components/sub/ChooseItemTypeButton'
import generateEmptyItem from 'utils/generateEmptyItem'
import Modal from 'components/sub/Modal'
import ItemForm from 'components/sub/ItemForm'
import persistItems from 'utils/persistItems'
import { withState } from 'recompose'

class BelongsToInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: null,
      options: [],
      isLoading: false,
      pendingMovement: null,
    }
  }

  componentWillMount() {
    const { value } = this.props
    this.handleInputChange('')
    this.fetchValueItems(value)
  }

  componentDidMount() {
    this.isComponentMounted = true
  }

  componentWillReceiveProps(nextProps) {
    const { value: nextValue } = nextProps
    const { value } = this.props

    if (nextValue !== value) {
      this.fetchValueItems(nextValue)
    }
  }

  componentWillUnmount() {
    this.isComponentMounted = false
  }

  fetchValueItems(value) {
    if (!value) {
      return
    }

    const { dispatch, multiple } = this.props
    const ids = multiple ? value : [value]

    dispatch(getItemsById({ ids }))
  }

  handleEditClose() {
    this.setState({ activeItem: null })
  }

  handleSubmit(items) {
    const { dispatch, multiple } = this.props
    const { item } = items.find(({ key }) => !key)
    const justCreated = !item.id
    const type = justCreated ? 'create' : 'update'

    persistItems(items, dispatch)
    .then((newItem) => {
      if (multiple) {
        const value = this.props.value || []
        const newValue = [].concat(value, newItem.id)
        this.props.onBlur(newValue)
      } else {
        this.props.onBlur(newItem.id)
      }

      const query = { 'filter[type]': newItem.relationships.item_type.data.id }
      dispatch(getItems({ query }))

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

  handleInputChange(input) {
    const {
      itemTypeIds,
      dispatch,
      setQuery,
    } = this.props

    this.setState({ isLoading: true })
    setQuery(input)

    const promises = itemTypeIds.map(id => {
      const query = { 'filter[type]': id }
      if (input) {
        query['filter[query]'] = input
      }

      return dispatch(getItems({ query }))
    })

    Promise.all(promises)
    .then(() => this.setState({ isLoading: false }))
  }

  handleChange(value) {
    this.props.onChange(value)
  }

  handleDrag(pendingMovement) {
    this.setState({ pendingMovement })
  }

  handleDrop() {
    if (!this.state.pendingMovement) {
      return
    }

    const { fromIndex, toIndex } = this.state.pendingMovement
    this.setState({ pendingMovement: null })
    this.props.onBlur(switchElements(this.props.value, fromIndex, toIndex))
  }

  handleDropCancel() {
    this.setState({ pendingMovement: null })
  }

  handleItemNew(itemType, fields) {
    const { locales } = this.props
    const item = generateEmptyItem(locales, fields, itemType)
    this.setState({
      activeItem: item,
      activeItemTypeId: itemType.id,
    })
  }

  renderModal() {
    const { itemTypes, locales, disabled } = this.props
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
          deepItems={[]}
        />
      </Modal>
    )
  }

  renderValue(option, index) {
    return (
      <SortableItem
        index={index}
        dropTargetName="belongs-to-item"
        onDrag={this.handleDrag.bind(this)}
        onDrop={this.handleDrop.bind(this)}
        onDropCancel={this.handleDropCancel.bind(this)}
        sortable={this.props.multiple}
      >
        <span>{option.label}</span>
      </SortableItem>
    )
  }

  render() {
    const { itemTypeIds, options, value, multiple, disabled } = this.props
    const { pendingMovement } = this.state

    let valueItems = value || (multiple ? [] : null)

    if (pendingMovement) {
      const { fromIndex, toIndex } = this.state.pendingMovement
      valueItems = switchElements(valueItems, fromIndex, toIndex)
    }

    return (
      <div>
        <div className="BelongsToInput">
          <div className="BelongsToInput__select">
            <SelectInput
              disabled={disabled}
              value={valueItems}
              isLoading={this.state.isLoading}
              options={options}
              onChange={this.handleChange.bind(this)}
              onBlur={this.props.onBlur}
              onInputChange={this.handleInputChange.bind(this)}
              multi={multiple}
              valueRenderer={this.renderValue.bind(this)}
            />
          </div>
          {
            !disabled &&
              <div className="BelongsToInput__button">
                <ChooseItemTypeButton
                  intlLabel={
                    multiple ?
                      'belongsToInput.create' :
                      'belongsToInput.replace'
                  }
                  itemTypeIds={itemTypeIds}
                  onSelect={this.handleItemNew.bind(this)}
                  menuItem={false}
                />
              </div>
          }
        </div>
        {
          this.state.activeItem &&
            this.renderModal()
        }
      </div>
    )
  }
}

BelongsToInput.propTypes = {
  itemTypeIds: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  locales: PropTypes.array,
  options: PropTypes.array,
  itemTypes: PropTypes.object,
  setQuery: PropTypes.func,
}

function mapStateToProps(state, props) {
  const itemTypes = props.itemTypeIds.reduce((acc, id) => {
    const itemType = state.itemTypes[id]
    const titleField = getTitleFieldForItemType(state, itemType)
    const fields = getFieldsForItemType(state, itemType)
    return Object.assign(
      {}, acc,
      {
        [id]: { itemType, titleField, fields },
      }
    )
  }, {})

  const locales = state.site ? state.site.attributes.locales : null
  const value = props.value
  let itemIds = []

  if (value) {
    itemIds = props.multiple ? value : [value]
  }

  const selectedItems = itemIds
    .map(id => state.items[id])
    .filter(x => !!x)

  const matchingItems = [].concat(
    ...props.itemTypeIds.map(id => {
      const query = { 'filter[type]': id }
      if (props.query) {
        query['filter[query]'] = props.query
      }

      return getItemsForQuery(state, query).items
    })
  )

  const options = [].concat(selectedItems, matchingItems)
    .map((item) => {
      const { titleField } = itemTypes[item.relationships.item_type.data.id]

      const title = buildTitleFromValue(
        getFieldValue(item, titleField, locales),
        titleField
      )

      return {
        value: item.id,
        label: title,
      }
    })
    .filter((option, index, array) => (
      array.map(i => i.value).indexOf(option.value) >= index
    ))

  return { itemTypes, locales, options }
}

export default withState('query', 'setQuery', '')(connect(mapStateToProps)(BelongsToInput))
