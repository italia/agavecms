import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import {
  fetch as getItem,
  destroy as destroyItem,
  duplicate as duplicateItem,
} from 'actions/items'
import { alert, notice } from 'actions/notifications'
import Spinner from 'components/sub/Spinner'
import Link from 'components/sub/Link'
import { canPerformActionOnItemType, getCurrentRole } from 'utils/storeQueries'

class Item extends Component {
  componentDidMount() {
    const { dispatch, params: { itemId } } = this.props

    if (itemId) {
      dispatch(getItem({ id: itemId }))
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, params: { itemId } } = this.props

    if (nextProps.params.itemId && nextProps.params.itemId !== itemId) {
      dispatch(getItem({ id: nextProps.params.itemId }))
    }
  }

  handleDuplicate(e) {
    const { dispatch, item } = this.props
    e.preventDefault()

    return dispatch(duplicateItem({ id: item.id }))
      .then(() => {
        dispatch(notice(this.t('editor.item.duplicate.success')))
      })
      .catch(() => {
        dispatch(alert(this.t('editor.item.duplicate.failure')))
      })
  }

  handleDestroy(e) {
    const { dispatch, item, itemType } = this.props

    e.preventDefault()

    if (!confirm(this.t('messages.areyousure'))) {
      return
    }

    dispatch(destroyItem({ id: item.id }))
      .then(() => {
        dispatch(notice(this.t('editor.item.destroy.success')))
        this.pushRoute(`/editor/item_types/${itemType.id}/items`)
      })
      .catch(({ data }) => {
        const associatedItems = data
          .filter(error => error.id === 'REQUIRED_BY_ASSOCIATION')
          .map(error => {
            const { details } = error.attributes
            const url = `/editor/item_types/${details.item_type_id}/items/${details.item_id}/edit`
            return (
              <li>
                <Link to={url}>
                  Record #{details.item_id} ({details.field_label} field)
                </Link>
              </li>
            )
          })

        dispatch(alert(
          <div>
            {this.t('editor.item.destroy.failure')}
            <ul>
              {associatedItems}
            </ul>
          </div>
        ))
      })
  }

  renderItem() {
    const { item, itemType, hasDeletePermission, canEditSchema } = this.props
    const { name, singleton } = itemType.attributes
    const type = item.id ? 'edit' : 'new'

    return (
      <div className="Page Item">
        <div className="Page__inner">
          <div className="Page__header">
            <div className="Page__title">
              {this.t(`${type}Item.title`, { name })}
            </div>
            {
              canEditSchema &&
                <div className="Page__code">
                  {itemType.attributes.api_key}
                </div>
            }
          </div>
        </div>
        <div className="Page__sidebar-container">
          <div className="Page__inner">
            {this.props.children}
          </div>
          {
            type === 'edit' &&
              <div className="Page__sidebar">
                <div className="sidebar">
                  <div className="sidebar__section">
                    <div className="sidebar__section__title">
                      Actions
                    </div>
                    <div className="sidebar__section__content">
                      <div>
                      {
                        item.id && !singleton &&
                          <a href="#" onClick={this.handleDuplicate.bind(this)}>
                            <span>{this.t('itemType.duplicate')}</span>
                          </a>
                      }
                      </div>
                      <div>
                        {
                          item.id && !singleton && hasDeletePermission &&
                            <a
                              href="#"
                              className="alert"
                              onClick={this.handleDestroy.bind(this)}
                            >
                              <span>{this.t('item.remove')}</span>
                            </a>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

  render() {
    const { item, itemType } = this.props

    return item && itemType ?
      this.renderItem() :
      this.renderLoading()
  }
}

Item.propTypes = {
  dispatch: PropTypes.func.isRequired,
  item: PropTypes.object,
  itemType: PropTypes.object,
  params: PropTypes.object.isRequired,
  lastEditor: PropTypes.string,
  children: PropTypes.element.isRequired,
  routes: PropTypes.array.isRequired,
  hasUpdatePermission: PropTypes.bool,
  hasDeletePermission: PropTypes.bool,
  canEditSchema: PropTypes.bool,
}

function mapStateToProps(state, props) {
  const itemType = state.itemTypes[props.params.itemTypeId]
  const item = props.params.itemId ?
    state.items[props.params.itemId] :
    {}
  const hasUpdatePermission = canPerformActionOnItemType(state, 'update', props.params.itemTypeId)
  const hasDeletePermission = canPerformActionOnItemType(state, 'delete', props.params.itemTypeId)
  const role = getCurrentRole(state)
  const canEditSchema = role && role.attributes.can_edit_schema

  return {
    item,
    itemType,
    canEditSchema,
    hasUpdatePermission,
    hasDeletePermission,
  }
}

export default connect(mapStateToProps)(Item)
