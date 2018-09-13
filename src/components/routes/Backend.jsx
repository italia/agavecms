import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { fetch as getSite } from 'actions/site'
import { fetch as getUser } from 'actions/users'
import { destroy as logout } from 'actions/session'
import { connect } from 'react-redux'
import { notice } from 'actions/notifications'
import NavigationBar from 'components/sub/NavigationBar'
import { getCurrentUser, getCurrentRole } from 'utils/storeQueries'
import Spinner from 'components/sub/Spinner'
import Title from 'react-document-title'

class Backend extends Component {
  constructor(props) {
    super(props)
    this.state = { isLoading: true }
  }

  componentDidMount() {
    const include = [
      'roles',
      'item_types',
      'item_types.fields',
      'item_types.singleton_item',
      'menu_items',
      'account',
      'users',
    ].join(',')

    Promise.all([
      this.props.dispatch(getSite({ force: true, query: { include } })),
      this.props.dispatch(getUser({ id: 'me' })),
    ])
    .then(() => {
      this.setState({ isLoading: false })
    })
  }

  handleLogout(e) {
    e.preventDefault()

    this.props.dispatch(logout())
    this.props.dispatch(notice(this.t('noAuth.signIn.logout.success')))
    this.pushRoute('/')
  }

  renderLoading() {
    return (
      <div className="FullpageLoader">
        <Spinner size={100} />
      </div>
    )
  }

  renderApp() {
    const {
      site,
      currentUser,
      hasMenuItems,
      hasItemTypes,
      canAccessSettings,
    } = this.props

    return (
      <Title title={`${site.attributes.name} - Agave CMS`}>
        <div className="Backend">
          <NavigationBar
            site={site}
            showContent={hasMenuItems && hasItemTypes}
            canAccessSettings={canAccessSettings}
            currentUser={currentUser}
            onLogout={this.handleLogout.bind(this)}
          />
          <div className="Backend__content">
            {this.props.children}
          </div>
        </div>
      </Title>
    )
  }

  render() {
    const { isLoading } = this.state

    return isLoading ?
      this.renderLoading() :
      this.renderApp()
  }
}

Backend.propTypes = {
  children: PropTypes.element,
  dispatch: PropTypes.func.isRequired,
  site: PropTypes.object,
  currentUser: PropTypes.object,
  hasMenuItems: PropTypes.bool,
  hasItemTypes: PropTypes.bool,
  canAccessSettings: PropTypes.bool,
}

function mapStateToProps(state) {
  const site = state.site
  const currentUser = getCurrentUser(state)
  const hasMenuItems = Object.values(state.menuItems).length > 0
  const hasItemTypes = Object.values(state.itemTypes).length > 0 &&
    Object.values(state.fields).length > 0
  const role = getCurrentRole(state)

  let canAccessSettings = false

  if (role) {
    canAccessSettings = (
      role.attributes.can_edit_site ||
        role.attributes.can_edit_schema ||
        role.attributes.can_manage_users
    )
  }

  return { site, currentUser, hasMenuItems, hasItemTypes, canAccessSettings }
}

export default connect(mapStateToProps)(Backend)
