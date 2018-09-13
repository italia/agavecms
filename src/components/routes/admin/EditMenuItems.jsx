import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import Tree from 'components/sub/MenuItemTree'
import cloneDeep from 'deep-clone'
import {
  update as updateMenuItem,
  create as createMenuItem,
  fetchAll as fetchMenuItems,
  destroy as destroyMenuItem,
} from 'actions/menuItems'
import generateEmptyMenuItem from 'utils/generateEmptyMenuItem'
import Modal from 'components/sub/Modal'
import MenuItemForm from 'components/sub/MenuItemForm'
import { alert, notice } from 'actions/notifications'
import { FormattedMessage } from 'react-intl'
import { menuItems as instructions } from 'instructions'

import Instructions from 'components/sub/Instructions'

class EditMenuItems extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pendingMovement: null,
      activeMenuItem: null,
      disableUpdate: false,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchMenuItems({ force: true }))
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

    const { dispatch } = this.props
    const { element } = this.buildModifiedMenuItem(false)
    delete element.relationships.children

    new Promise((resolve) => {
      this.setState({ disableUpdate: true }, resolve)
    })
      .then(() => {
        return dispatch(updateMenuItem({ id: element.id, data: element }))
      })
      .then(() => {
        return dispatch(fetchMenuItems())
      })
      .then(() => {
        dispatch(notice(this.t('admin.menuItem.reorder.success')))
        this.setState({ pendingMovement: null, disableUpdate: false })
      })
      .catch(() => {
        dispatch(alert(this.t('admin.menuItem.reorder.failure')))
        this.setState({ pendingMovement: null, disableUpdate: false })
      })
  }

  handleDropCancel() {
    this.setState({ pendingMovement: null })
  }

  handleEdit(menuItem) {
    this.setState({ activeMenuItem: menuItem })
  }

  handleNew(e) {
    e.preventDefault()
    const menuItem = generateEmptyMenuItem()
    this.setState({ activeMenuItem: menuItem })
  }

  handleEditClose() {
    this.setState({ activeMenuItem: null })
  }

  handleSubmit(menuItem) {
    const { dispatch } = this.props
    let promise

    const payload = cloneDeep(menuItem)
    delete payload.relationships.children

    if (menuItem.id) {
      promise = dispatch(updateMenuItem({ id: menuItem.id, data: payload }))
    } else {
      promise = dispatch(createMenuItem({ data: payload }))
    }

    const i18nToken = menuItem.id ? 'update' : 'create'

    return promise
      .then(() => {
        dispatch(notice(this.t(`admin.menuItem.${i18nToken}.success`)))
        this.setState({ activeMenuItem: null })
      })
      .catch(() => {
        dispatch(alert(this.t(`admin.menuItem.${i18nToken}.failure`)))
      })
  }

  handleDestroy(menuItem) {
    const { dispatch } = this.props

    if (!confirm(this.t('messages.areyousure'))) {
      return
    }

    dispatch(destroyMenuItem({ id: menuItem.id }))
      .then(() => {
        dispatch(notice(this.t('admin.menuItem.destroy.success')))
        dispatch(fetchMenuItems())
        this.setState({ pendingMovement: null })
      })
      .catch(() => {
        dispatch(alert(this.t('admin.menuItem.destroy.failure')))
        this.setState({ pendingMovement: null })
      })
  }

  buildModifiedMenuItem(pending) {
    const { menuItems } = this.props
    const { draggedId, overId, asChild } = this.state.pendingMovement
    const index = menuItems.findIndex(i => i.id === draggedId)
    const draggedElement = cloneDeep(menuItems[index])

    if (asChild) {
      draggedElement.attributes.position = pending ? -0.5 : 0
      draggedElement.relationships.parent.data = overId ?
        { type: 'menu_item', id: overId } :
        null
    } else {
      const overElement = menuItems.find(i => i.id === overId)
      draggedElement.attributes.position = overElement.attributes.position + (pending ? 0.5 : 1)
      draggedElement.relationships.parent = cloneDeep(overElement.relationships.parent)
    }

    return { element: draggedElement, index }
  }

  renderMenuItems() {
    const { menuItems, itemTypes } = this.props
    let sortedMenuItems = menuItems

    if (this.state.pendingMovement) {
      const { element, index } = this.buildModifiedMenuItem(true)
      sortedMenuItems = menuItems.slice()
      sortedMenuItems[index] = element
    }

    const rootElements = sortedMenuItems
      .filter((i) => !i.relationships.parent.data)
      .sort((a, b) => a.attributes.position - b.attributes.position)

    return (
      <div>
        <div className="MenuItems">
          <Tree
            menuItems={sortedMenuItems}
            itemTypes={itemTypes}
            elements={rootElements}
            parentId={null}
            onDrag={(...args) => this.handleDrag(...args)}
            onDrop={(...args) => this.handleDrop(...args)}
            onDropCancel={(...args) => this.handleDropCancel(...args)}
            onEdit={(...args) => this.handleEdit(...args)}
            onDestroy={(...args) => this.handleDestroy(...args)}
          />
        </div>
      </div>
    )
  }

  renderBlankSlate() {
    return (
      <div className="blank-slate">
        <p className="blank-slate__description">
          {this.t('menuItems.noMenuItems')}
        </p>
        <a
          href="#"
          onClick={this.handleNew.bind(this)}
          className="button button--large button--primary"
        >
          <FormattedMessage id="menuItems.add" />
        </a>
      </div>
    )
  }

  render() {
    return (
      <div>
        <div className="Page">
          <div className="Page__inner">
            <div className="Page__header">
              <h1 className="Page__title">
                <FormattedMessage id="adminArea.splitPane.menuSettings" />
              </h1>
              <a
                href="#"
                onClick={this.handleNew.bind(this)}
                className="Page__action"
              >
                <i className="icon--add" />
                <span><FormattedMessage id="menuItems.add" /></span>
              </a>
            </div>
            <div className="Page__content--note">
              <Instructions value={instructions()} />
            </div>
            <div className="Page__content Page__content--transparent">
              {
                this.props.menuItems.length > 0 ?
                  this.renderMenuItems() :
                  this.renderBlankSlate()
              }
            </div>
          </div>
          {
            this.state.activeMenuItem &&
              <Modal
                localeKey={this.state.activeMenuItem.id ? 'menuitem.edit' : 'menuitem.add'}
                onClose={this.handleEditClose.bind(this)}
              >
                <MenuItemForm
                  menuItem={this.state.activeMenuItem}
                  itemTypes={this.props.itemTypes}
                  onSubmit={this.handleSubmit.bind(this)}
                />
              </Modal>
          }
        </div>
      </div>
    )
  }
}

EditMenuItems.propTypes = {
  dispatch: PropTypes.func.isRequired,
  itemTypes: PropTypes.array,
  menuItems: PropTypes.array,
}

function mapStateToProps(state) {
  const itemTypes = Object.values(state.itemTypes)

  const menuItems = Object.values(state.menuItems)
    .sort((a, b) => a.attributes.position - b.attributes.position)

  return { itemTypes, menuItems }
}

export default connect(mapStateToProps)(EditMenuItems)
