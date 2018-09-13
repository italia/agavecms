import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import Link from 'components/sub/Link'
import Spinner from 'components/sub/Spinner'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import updeep from 'updeep'
import { getCurrentRole } from 'utils/storeQueries'

class ItemTypesBar extends Component {
  constructor(props) {
    super(props)
    this.state = { openedPaths: {} }
  }

  handleToggle(path, e) {
    e.stopPropagation()
    e.preventDefault()

    const openedPaths = updeep(
      { [path.join('_')]: x => !x },
      this.state.openedPaths
    )

    this.setState({ openedPaths })
  }

  handleOpen(path) {
    const openedPaths = updeep(
      { [path.join('_')]: () => true },
      this.state.openedPaths
    )

    this.setState({ openedPaths })
  }

  renderMenuItems() {
    const rootMenuItems = Object.values(this.props.menuItems)
      .filter((i) => !i.relationships.parent.data)
      .sort((a, b) => a.attributes.position - b.attributes.position)

    return rootMenuItems.map(this.renderMenuItem.bind(this, []))
  }

  renderMenuItem(path, menuItem) {
    const { itemTypes, menuItems, expandMenuItems, singletonItems } = this.props
    let itemType = null
    let toggleLink = null
    let isOpen = false

    if (menuItem.relationships.item_type.data) {
      itemType = itemTypes[menuItem.relationships.item_type.data.id]
    }

    const subItems = menuItem.relationships.children.data
      .map(({ id }) => menuItems[id])
      .sort((a, b) => a.attributes.position - b.attributes.position)

    const label = menuItem.attributes.label

    if (!expandMenuItems && subItems.length > 0) {
      isOpen = expandMenuItems ?
        true :
        this.state.openedPaths[path.concat(menuItem.id).join('_')]

      toggleLink = (
        <span
          onClick={this.handleToggle.bind(this, path.concat(menuItem.id))}
          className={`ItemTypesBar__item__link__toggler ${isOpen ? 'is-open' : ''}`}
        />
      )
    }

    let link

    if (itemType) {
      let url
      let invalid = false

      if (itemType.attributes.singleton) {
        const item = itemType.relationships.singleton_item.data
        if (item) {
          url = `/editor/item_types/${itemType.id}/items/${item.id}/edit`

          if (!singletonItems[item.id].attributes.is_valid) {
            invalid = true
          }
        } else {
          url = `/editor/item_types/${itemType.id}/items/new`
        }
      } else {
        url = `/editor/item_types/${itemType.id}/items`
      }

      link = (
        <Link
          key="link"
          activeClassName="ItemTypesBar__item__link--active"
          className={
            `ItemTypesBar__item__link
            ItemTypesBar__item__link--level-${path.length}`
          }
          onClick={toggleLink && this.handleOpen.bind(this, path.concat(menuItem.id))}
          to={url}
        >
          {label}
          {
            invalid &&
              <div className="ItemTypesBar__item__link__invalid-tag" />
          }
          {toggleLink}
        </Link>
      )
    } else {
      link = (
        <span
          key="link"
          className={
            `ItemTypesBar__item__link
            ItemTypesBar__item__link--level-${path.length}`
          }
        >
          {label}
          {toggleLink}
        </span>
      )
    }

    let subItemComponents = null

    if (subItems.length > 0 && (expandMenuItems || isOpen)) {
      subItemComponents = (
        <ul
          key="subitems"
          className="ItemTypesBar__item__children"
        >
          {subItems.map(this.renderMenuItem.bind(this, path.concat(menuItem.id)))}
        </ul>
      )
    }

    return (
      <li
        className="ItemTypesBar__item"
        key={menuItem.id}
      >
        {link}
        {subItemComponents}
      </li>
    )
  }

  render() {
    const { canEditFavicon } = this.props

    return (
      <div className="ItemTypesBar">
        {
          this.props.isLoading ?
            <Spinner size={100} /> :
            <ul>
              {this.renderMenuItems()}
              {
                canEditFavicon &&
                  <li className="ItemTypesBar__item">
                    <Link
                      className="ItemTypesBar__item__link ItemTypesBar__item__link--level-0"
                      activeClassName="ItemTypesBar__item__link--active"
                      to="/editor/settings"
                      data-test-hook="manage-editor-settings"
                    >
                      <FormattedMessage id="menu.settings" />
                    </Link>
                  </li>
              }
            </ul>
        }
      </div>
    )
  }
}

ItemTypesBar.propTypes = {
  itemTypes: PropTypes.object.isRequired,
  menuItems: PropTypes.object.isRequired,
  expandMenuItems: PropTypes.bool,
  singletonItems: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  canEditFavicon: PropTypes.bool,
}

function mapStateToProps(state) {
  const itemTypes = state.itemTypes
  const menuItems = state.menuItems
  const isLoading = !state.site
  const role = getCurrentRole(state)

  let expandMenuItems = true

  const singletonItems = Object.values(itemTypes)
    .filter(ct => ct.attributes.singleton)
    .map(ct => ct.relationships.singleton_item.data)
    .filter(data => !!data)
    .map(data => state.items[data.id])
    .reduce(
      (acc, item) => {
        return Object.assign(acc, { [item.id]: item })
      },
      {}
    )

  if (Object.values(menuItems).length >= 10) {
    expandMenuItems = false
  }

  return {
    isLoading,
    itemTypes,
    menuItems,
    singletonItems,
    expandMenuItems,
    canEditFavicon: role && role.attributes.can_edit_favicon,
  }
}

export default connect(mapStateToProps)(ItemTypesBar)
