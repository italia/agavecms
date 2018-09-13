import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import { getFieldsForItemType } from 'utils/storeQueries'

class ChooseContenTypeButton extends Component {
  constructor(props) {
    super(props)
    this.state = { isDropdownOpen: false }
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true)
  }

  handleClickOutside(e) {
    if (!this.container.contains(e.target)) {
      this.setState({ isDropdownOpen: false })
    }
  }

  handleSelect(itemType, fields, e) {
    e.preventDefault()
    this.setState({ isDropdownOpen: false })
    this.props.onSelect(itemType, fields)
  }

  handleToggleDropdown(e) {
    e.preventDefault()
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen })
  }

  renderDropdownItem(id) {
    const { itemTypes } = this.props
    const { itemType, fields } = itemTypes[id]

    return (
      <a
        key={id}
        className="dropdown-button__dropdown__item"
        href="#"
        onClick={this.handleSelect.bind(this, itemType, fields)}
      >
        {itemType.attributes.name}
      </a>
    )
  }

  render() {
    const { itemTypeIds, itemTypes, intlLabel } = this.props
    const { isDropdownOpen } = this.state

    if (itemTypeIds.length === 0) {
      return <div className="gray">Nessun modello disponibile, verifica le impostazioni.</div>
    }

    const className = this.props.menuItem ?
      '' :
      'dropdown-button__button'

    return (
      <div className="dropdown-button" ref={ref => this.container = ref}>
        <a
          href="#"
          className={className}
          onClick={
            itemTypeIds.length > 1 ?
              this.handleToggleDropdown.bind(this) :
              this.handleSelect.bind(
                this,
                itemTypes[itemTypeIds[0]].itemType,
                itemTypes[itemTypeIds[0]].fields
              )
          }
        >
          {
            !this.props.menuItem && <i className="icon--add" />
          }
          <span>{this.t(intlLabel)}</span>
        </a>
        {
          isDropdownOpen &&
            <div className="dropdown-button__dropdown">
              {itemTypeIds.map(this.renderDropdownItem.bind(this))}
            </div>
        }
      </div>
    )
  }
}

ChooseContenTypeButton.propTypes = {
  itemTypeIds: PropTypes.array.isRequired,
  itemTypes: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  intlLabel: PropTypes.string.isRequired,
  menuItem: PropTypes.bool,
}

function mapStateToProps(state, props) {
  const itemTypes = props.itemTypeIds.reduce((acc, id) => {
    const itemType = state.itemTypes[id]
    const fields = getFieldsForItemType(state, itemType)
    return Object.assign(
      {}, acc,
      {
        [id]: { itemType, fields },
      }
    )
  }, {})

  return { itemTypes }
}

export default connect(mapStateToProps)(ChooseContenTypeButton)
