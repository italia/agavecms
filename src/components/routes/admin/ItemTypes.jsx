import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import cloneDeep from 'deep-clone'
import {
  create as createItemType,
  fetchAll as fetchItemTypes,
} from 'actions/itemTypes'
import { fetch as getSite } from 'actions/site'
import generateEmptyItemType from 'utils/generateEmptyItemType'
import Modal from 'components/sub/Modal'
import ItemTypeForm from 'components/sub/ItemTypeForm'
import { alert, notice } from 'actions/notifications'
import convertToFormErrors from 'utils/convertToFormErrors'
import Link from 'components/sub/Link'
import SplitPane from 'react-split-pane'
import FlipMove from 'react-flip-move'
import { getFieldsForItemType } from 'utils/storeQueries'

class EditItemTypes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItemType: null,
      height: 43,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchItemTypes())
  }

  handleNew(e) {
    e.preventDefault()
    const itemType = generateEmptyItemType()
    this.setState({ activeItemType: itemType })
  }

  handleNewClose() {
    this.setState({ activeItemType: null })
  }

  handleSubmit(itemType) {
    const { dispatch } = this.props

    const payload = cloneDeep(itemType)

    return dispatch(createItemType({ data: payload }))
      .then(response => {
        const include = [
          'item_types',
          'item_types.singleton_item',
          'menu_items',
        ].join(',')
        return dispatch(getSite({ force: true, query: { include } }))
          .then(() => response)
      })
      .then(({ data }) => {
        dispatch(notice(this.t('admin.itemType.create.success')))
        this.setState({ activeItemType: null })
        this.pushRoute(`/admin/item_types/${data.id}`)
      })
      .catch((error) => {
        dispatch(alert(this.t('admin.itemType.create.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  handleToggleBlocks() {
    const newHeight = this.state.height < 60 ? 350 : 43

    this.splitPane.setState(
      {
        resized: false,
        draggedSize: undefined,
      },
      () => {
        this.setState({
          height: newHeight,
        })
      }
    )
  }

  handleHeightChange(height) {
    this.setState({ height })
  }

  renderItemType(type, itemType) {
    const classNames = ['ItemTypeRow']

    if (type) {
      classNames.push(`ItemTypeRow--${type}`)
    }

    return (
      <Link
        to={`/admin/item_types/${itemType.id}`}
        className={classNames.join(' ')}
        activeClassName="ItemTypeRow--active"
        key={itemType.id}
      >
        <div className="ItemTypeRow__name">
          {itemType.attributes.name}
        </div>
        <div className="ItemTypeRow__api">
          {itemType.attributes.api_key}
        </div>
      </Link>
    )
  }

  renderBlankSlate() {
    return (
      <div className="Items__blank-slate">
        <div className="Items__blank-slate__inner">
          <div className="Items__blank-slate__title">
            {this.t('admin.itemTypes.noItemTypes.title')}
          </div>
          <div className="Items__blank-slate__description">
            {this.t('admin.itemTypes.noItemTypes.description')}
          </div>
        </div>
        <div className="Items__blank-slate__arrow" />
      </div>
    )
  }

  renderItemTypes() {
    const { itemTypes, blocks, other } = this.props

    if (itemTypes.length === 0) {
      return (
        <div className="Items">
          {this.renderBlankSlate()}
          <a
            href="#"
            onClick={this.handleNew.bind(this)}
            className="Items__button"
          >
            <i className="icon--add" />
          </a>
        </div>
      )
    }

    if (blocks.length === 0) {
      return (
        <div className="Items">
          <div className="Items__items">
            <FlipMove
              staggerDelayBy={20}
              enterAnimation="accordionVertical"
              leaveAnimation="accordionVertical"
            >
              {other.map(this.renderItemType.bind(this, null))}
            </FlipMove>
          </div>
          <a
            href="#"
            onClick={this.handleNew.bind(this)}
            className="Items__button"
          >
            <i className="icon--add" />
          </a>
        </div>
      )
    }

    return (
      <div className="Items">
        <SplitPane
          defaultSize={this.state.height}
          primary="second"
          split="horizontal"
          ref={el => this.splitPane = el}
          onChange={this.handleHeightChange.bind(this)}
        >
          <div className="Items__wrap">
            <div className="Items__items">
              <FlipMove
                staggerDelayBy={20}
                enterAnimation="accordionVertical"
                leaveAnimation="accordionVertical"
              >
                {other.map(this.renderItemType.bind(this, null))}
              </FlipMove>
            </div>
            <a
              href="#"
              onClick={this.handleNew.bind(this)}
              className="Items__button"
            >
              <i className="icon--add" />
            </a>
          </div>
          <div className="Items__subitems">
            <div className="Items__subitems__title">
              Rich-text/Embed blocks ({ blocks.length })
              <button
                className="Items__subitems__open-close"
                onClick={this.handleToggleBlocks.bind(this)}
              >
                <i className={this.state.height < 60 ? 'icon--chevron-up' : 'icon--chevron-down'} />
              </button>
            </div>
            <div className="Items__subitems__content">
              <FlipMove
                staggerDelayBy={20}
                enterAnimation="accordionVertical"
                leaveAnimation="accordionVertical"
              >
                {blocks.map(this.renderItemType.bind(this, 'block'))}
              </FlipMove>
            </div>
          </div>
        </SplitPane>
      </div>
    )
  }

  render() {
    return (
      <SplitPane minSize={300} defaultSize={400} split="vertical">
        <div>
          {
            this.props.itemTypes &&
            this.renderItemTypes()
          }
          {
            this.state.activeItemType &&
              <Modal
                localeKey="itemType.add"
                onClose={this.handleNewClose.bind(this)}
              >
                <ItemTypeForm
                  itemType={this.state.activeItemType}
                  onSubmit={this.handleSubmit.bind(this)}
                />
              </Modal>
          }
        </div>
        <div>
          {this.props.children}
        </div>
      </SplitPane>
    )
  }
}

EditItemTypes.propTypes = {
  dispatch: PropTypes.func.isRequired,
  itemTypes: PropTypes.array,
  blocks: PropTypes.array,
  other: PropTypes.array,
  children: PropTypes.element,
}

function mapStateToProps(state) {
  const itemTypes = Object.values(state.itemTypes)
    .sort((a, b) => a.attributes.name.localeCompare(b.attributes.name))

  let blockItemTypeIds = []

  itemTypes.forEach(itemType => {
    const fields = getFieldsForItemType(state, itemType)

    fields.forEach(({ attributes: { field_type: fieldType, validators, appeareance } }) => {
      if (fieldType === 'rich_text') {
        blockItemTypeIds = blockItemTypeIds.concat(
          validators.rich_text_blocks.item_types
        )
      } else if (fieldType === 'link' && appeareance.type === 'embed') {
        blockItemTypeIds = blockItemTypeIds.concat(
          validators.item_item_type.item_types
        )
      } else if (fieldType === 'links' && appeareance.type === 'embed') {
        blockItemTypeIds = blockItemTypeIds.concat(
          validators.items_item_type.item_types
        )
      }
    })
  })

  blockItemTypeIds = blockItemTypeIds
    .filter((id, index, array) => array.indexOf(id) >= index)

  const other = []
  const blocks = []

  itemTypes.forEach(itemType => {
    if (blockItemTypeIds.includes(itemType.id)) {
      blocks.push(itemType)
    } else {
      other.push(itemType)
    }
  })

  return { itemTypes, blocks, other }
}

export default connect(mapStateToProps)(EditItemTypes)
