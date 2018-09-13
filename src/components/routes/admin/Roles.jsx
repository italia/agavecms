import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import Link from 'components/sub/Link'
import { fetchAll as fetchRoles } from 'actions/roles'
import SplitPane from 'react-split-pane'
import Spinner from 'components/sub/Spinner'
import FlipMove from 'react-flip-move'
import { getCurrentRole } from 'utils/storeQueries'

class Roles extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchRoles())
  }

  renderRole(role) {
    return (
      <Link
        className="ItemRow"
        activeClassName="ItemRow--active"
        to={`/admin/roles/${role.id}/edit`}
        key={role.id}
      >
        <div className="ItemRow__item">
          <div className="ItemRow__item__inner">
            <div className="ItemRow__item__content">
              <div className="ItemRow__item__title">
                {role.attributes.name}
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  renderBlankSlate() {
    return (
      <div className="Items__blank-slate">
        <div className="Items__blank-slate__inner">
          <div className="Items__blank-slate__image">
            <img src="/assets/images/role.svg" alt="Roles" />
          </div>
          <div className="Items__blank-slate__title">
            {this.t('editor.editors.noEditors.title')}
          </div>
          <div className="Items__blank-slate__description">
            {this.t('editor.editors.noEditors.description')}
          </div>
        </div>
        <div className="Items__blank-slate__arrow" />
      </div>
    )
  }

  renderRoles() {
    const { roles } = this.props

    return (
      <div className="Items">
        {
          roles.length > 0 ?
            <div className="Items__items">
              <FlipMove
                staggerDelayBy={20}
                enterAnimation="accordionVertical"
                leaveAnimation="accordionVertical"
              >
                {roles.map(this.renderRole.bind(this))}
              </FlipMove>
            </div> :
            this.renderBlankSlate()
        }
        <Link
          className="Items__button"
          to="/admin/roles/new"
        >
          <i className="icon--add" />
        </Link>
      </div>
    )
  }

  render() {
    if (!this.props.canManageUsers) {
      return (
        <div className="Dashboard">
          {this.props.children}
        </div>
      )
    }

    return (
      <SplitPane minSize={300} defaultSize={400} split="vertical">
        <div>
          {
            this.props.roles ?
              this.renderRoles() :
              <Spinner size={100} />
          }
        </div>
        <div>
          {this.props.children}
        </div>
      </SplitPane>
    )
  }
}

Roles.propTypes = {
  dispatch: PropTypes.func.isRequired,
  roles: PropTypes.array,
  children: PropTypes.element,
  canManageUsers: PropTypes.bool,
}

function mapStateToProps(state) {
  const roles = Object.values(state.roles)
    .sort((a, b) => a.attributes.name.localeCompare(b.attributes.name))

  const role = getCurrentRole(state)
  const canManageUsers = role.attributes.can_manage_users

  return { roles, canManageUsers }
}

export default connect(mapStateToProps)(Roles)
