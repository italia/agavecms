import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import { getFieldsForItemType } from 'utils/storeQueries'
import FieldRow from 'components/sub/FieldRow'
import Modal from 'components/sub/Modal'
import switchElements from 'utils/switchElements'
import cloneDeep from 'deep-clone'
import { alert, notice } from 'actions/notifications'
import {
  update as updateField,
  destroy as destroyField,
  create as createField,
} from 'actions/fields'
import { fetch as getSite } from 'actions/site'
import {
  update as updateItemType,
  destroy as destroyItemType,
  fetch as fetchItemType,
  duplicate as duplicateItemType,
} from 'actions/itemTypes'
import FieldForm from 'components/sub/FieldForm'
import generateEmptyField from 'utils/generateEmptyField'
import ItemTypeForm from 'components/sub/ItemTypeForm'
import FieldTypeSelector from 'components/sub/FieldTypeSelector'
import convertToFormErrors from 'utils/convertToFormErrors'
import { FormattedMessage, injectIntl } from 'react-intl'
import Spinner from 'components/sub/Spinner'
import FlipMove from 'react-flip-move'

class ItemType extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pendingMovement: null,
      disableUpdate: false,
      isItemTypeModalOpen: false,
      activeField: null,
      isNewFieldTypeModalOpen: false,
    }
  }

  componentDidMount() {
    const { dispatch, params: { itemTypeId } } = this.props
    dispatch(fetchItemType({ id: itemTypeId }))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.itemTypeId !== this.props.params.itemTypeId) {
      const { dispatch, params: { itemTypeId } } = this.props
      dispatch(fetchItemType({ id: itemTypeId }))
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextState.disableUpdate) {
      return false
    }

    return super.shouldComponentUpdate(nextProps, nextState, nextContext)
  }

  handleEditItemType(e) {
    e.preventDefault()
    this.setState({ isItemTypeModalOpen: true })
  }

  handleSubmitItemType(itemType) {
    const { dispatch } = this.props

    const payload = cloneDeep(itemType)

    return dispatch(updateItemType({ id: itemType.id, data: payload }))
      .then(() => {
        dispatch(notice(this.t('admin.itemType.update.success')))
        this.setState({ isItemTypeModalOpen: null })
      })
      .catch((error) => {
        dispatch(alert(this.t('admin.itemType.update.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  handleCloseItemType() {
    this.setState({ isItemTypeModalOpen: false })
  }

  handleDestroy(e) {
    const { dispatch } = this.props

    e.preventDefault()

    if (!confirm(this.t('messages.areyousure'))) {
      return
    }

    dispatch(destroyItemType({ id: this.props.itemType.id }))
      .then(() => {
        return this.refreshState()
      })
      .then(() => {
        dispatch(notice(this.t('admin.itemType.destroy.success')))
        this.pushRoute('/admin/item_types')
      })
      .catch(() => {
        dispatch(this.t(alert('admin.itemType.destroy.failure')))
      })
  }

  handleEditField(field) {
    this.setState({ activeField: field })
  }

  handleNewField(e) {
    e.preventDefault()
    this.setState({ isNewFieldTypeModalOpen: true })
  }

  handleEditNewField(fieldType) {
    const field = generateEmptyField(fieldType)
    this.setState({
      isNewFieldTypeModalOpen: false,
      activeField: field,
    })
  }

  handleCloseField() {
    this.setState({
      activeField: null,
      isNewFieldTypeModalOpen: false,
    })
  }

  handleSubmitField(field) {
    const { dispatch, params: { itemTypeId } } = this.props
    let promise

    const payload = cloneDeep(field)

    if (field.id) {
      promise = dispatch(updateField({ id: field.id, data: payload }))
    } else {
      promise = dispatch(createField({ itemTypeId, data: payload }))
    }

    return promise
      .then(() => {
        this.setState({ activeField: null })
        return this.refreshState()
      })
      .then(() => {
        const message = `admin.itemType.${field.id ? 'update' : 'create'}Field.success`
        dispatch(notice(this.t(message)))
      })
      .catch((error) => {
        const message = `admin.itemType.${field.id ? 'update' : 'create'}Field.failure`
        dispatch(alert(this.t(message)))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  refreshState() {
    const { dispatch } = this.props

    const include = [
      'item_types',
      'item_types.singleton_item',
      'item_types.fields',
      'menu_items',
    ].join(',')

    return dispatch(getSite({ force: true, query: { include } }))
  }

  handleDestroyField(field) {
    const { dispatch, params: { itemTypeId } } = this.props

    if (!confirm(this.t('messages.areyousure'))) {
      return
    }

    dispatch(destroyField({ id: field.id }))
      .then(() => {
        dispatch(notice(this.t('admin.itemType.destroyField.success')))
        dispatch(fetchItemType({ id: itemTypeId }))
        this.setState({ pendingMovement: null })
      })
      .catch((error) => {
        this.setState({ pendingMovement: null })

        const neededBySlugField = error.data &&
          error.data.find(e => e.id === 'USED_AS_SLUG_SOURCE')

        if (neededBySlugField) {
          dispatch(alert(this.t(
            'admin.itemType.destroyField.neededBySlugField',
            { slugField: neededBySlugField.attributes.details.field_label }
          )))
        } else {
          dispatch(alert(this.t('admin.itemType.destroyField.failure')))
        }
      })
  }

  handleDrop(field) {
    if (!this.state.pendingMovement) {
      return
    }

    const { dispatch, params } = this.props
    const { toIndex } = this.state.pendingMovement
    const { position } = this.props.fields[toIndex].attributes
    const { id, type, attributes } = field
    const newAttributes = Object.assign(
      {}, attributes,
      { position }
    )

    delete newAttributes.updated_at

    new Promise((resolve) => {
      this.setState({ disableUpdate: true }, resolve)
    })
      .then(() => {
        return dispatch(updateField({
          id, data: { id, type, attributes: newAttributes },
        }))
      })
      .then(() => {
        return dispatch(fetchItemType({ id: params.itemTypeId }))
      })
      .then(() => {
        dispatch(notice(this.t('admin.itemType.reorderField.success')))
        this.setState({ pendingMovement: null, disableUpdate: false })
      })
      .catch(() => {
        dispatch(alert(this.t('admin.itemType.reorderField.failure')))
        this.setState({ pendingMovement: null, disableUpdate: false })
      })
  }

  handleDrag(pendingMovement) {
    this.setState({ pendingMovement })
  }

  handleDropCancel() {
    this.setState({ pendingMovement: null })
  }

  handleDuplicate(id, e) {
    const { dispatch } = this.props
    e.preventDefault()

    return dispatch(duplicateItemType({ id }))
      .then(() => {
        return this.refreshState()
      })
      .then(() => {
        dispatch(notice(this.t('admin.itemType.duplicateItemType.success')))
      })
      .catch(() => {
        dispatch(alert(this.t('admin.itemType.duplicateItemType.failure')))
      })
  }

  renderField(field, index) {
    const { locales } = this.props

    return (
      <FieldRow
        key={field.id}
        index={index}
        field={field}
        locales={locales}
        onDrag={this.handleDrag.bind(this)}
        onDrop={this.handleDrop.bind(this)}
        onDropCancel={this.handleDropCancel.bind(this)}
        onEdit={this.handleEditField.bind(this, field)}
        onDestroy={this.handleDestroyField.bind(this, field)}
      />
    )
  }

  renderFields() {
    const { fields } = this.props
    const { pendingMovement, disableUpdate } = this.state
    let sortedFields = fields

    if (pendingMovement) {
      const { fromIndex, toIndex } = pendingMovement
      sortedFields = switchElements(fields, fromIndex, toIndex)
    }

    return (
      <div className="Page__content Page__content--transparent">
        <FlipMove
          staggerDelayBy={20}
          disableAllAnimations={!!pendingMovement || disableUpdate}
        >
          {sortedFields.map(this.renderField.bind(this))}
        </FlipMove>
      </div>
    )
  }

  renderItemType() {
    const { itemType, fields } = this.props

    return (
      <div className="Page">
        <div className="Page__inner">
          <div className="Page__header">
            <div className="Page__title">
              {itemType.attributes.name}
            </div>
          </div>
          <div className="Page__header">
            <a
              href="#"
              onClick={this.handleEditItemType.bind(this)}
              className="Page__action"
            >
              <i className="icon--settings" />
              <span><FormattedMessage id="itemType.edit" /></span>
            </a>
            <a
              href="#"
              onClick={this.handleNewField.bind(this)}
              className="Page__action"
            >
              <i className="icon--add" />
              <span><FormattedMessage id="itemType.row.add" /></span>
            </a>
            <div className="Page__space" />
            <a
              href="#"
              onClick={this.handleDuplicate.bind(this, itemType.id)}
              className="Page__action"
            >
              <span><FormattedMessage id="itemType.duplicate" /></span>
            </a>
            <a
              href="#"
              onClick={this.handleDestroy.bind(this)}
              className="Page__action--delete"
            >
              <i className="icon--delete" />
              <span><FormattedMessage id="itemType.row.delete" /></span>
            </a>
          </div>
          {
            fields.length === 0 ?
              this.renderBlankSlate() :
              this.renderFields()
          }
          {
            this.state.activeField &&
              <Modal
                freeContent
                title={
                  this.state.activeField.id ?
                    this.t('itemType.editField') :
                    this.t(
                      'itemType.addField',
                      {
                        fieldType: this.t(
                          `fieldType.${this.state.activeField.attributes.field_type}`
                        ),
                      }
                    )
                }
                onClose={this.handleCloseField.bind(this)}
              >
                <FieldForm
                  itemTypeId={itemType.id}
                  field={this.state.activeField}
                  onSubmit={this.handleSubmitField.bind(this)}
                />
              </Modal>
          }
          {
            this.state.isNewFieldTypeModalOpen &&
              <Modal
                big
                localeKey="itemType.chooseFieldType"
                onClose={this.handleCloseField.bind(this)}
              >
                <FieldTypeSelector
                  onSelect={this.handleEditNewField.bind(this)}
                />
              </Modal>
          }
          {
            this.state.isItemTypeModalOpen &&
              <Modal
                localeKey="itemType.editItemType"
                onClose={this.handleCloseItemType.bind(this)}
              >
                <ItemTypeForm
                  itemType={this.props.itemType}
                  onSubmit={this.handleSubmitItemType.bind(this)}
                />
              </Modal>
          }
        </div>
      </div>
    )
  }

  renderLoading() {
    return (
      <div>
        <Spinner size={80} />
      </div>
    )
  }

  renderBlankSlate() {
    const { itemType } = this.props

    return (
      <div className="blank-slate">
        <p className="blank-slate__title">
          {this.t('admin.itemType.noFields.title')}
        </p>
        <p className="blank-slate__description">
          {this.t('admin.itemType.noFields.description', { name: itemType.attributes.name })}
        </p>
        <a
          href="#"
          onClick={this.handleNewField.bind(this)}
          className="button button--large button--primary"
        >
          <i className="icon--add" />
          <span><FormattedMessage id="itemType.row.add" /></span>
        </a>
      </div>
    )
  }

  render() {
    const { itemType } = this.props

    return (
      <div>
        {
          itemType ?
            this.renderItemType() :
            this.renderLoading()
        }
      </div>
    )
  }
}

ItemType.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fields: PropTypes.array,
  locales: PropTypes.array,
  itemType: PropTypes.object,
  params: PropTypes.object.isRequired,
}

function mapStateToProps(state, props) {
  const itemType = state.itemTypes[props.params.itemTypeId]
  const locales = state.site ? state.site.attributes.locales : []
  const fields = getFieldsForItemType(state, itemType)
    .sort((a, b) => a.attributes.position - b.attributes.position)
    .filter(x => !!x)

  return { itemType, fields, locales }
}

export default injectIntl(connect(mapStateToProps)(ItemType))
