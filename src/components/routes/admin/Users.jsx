import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import Link from 'components/sub/Link'
import { fetchAll as fetchUsers } from 'actions/users'
import SplitPane from 'react-split-pane'
import Spinner from 'components/sub/Spinner'
import Avatar from 'components/sub/Avatar'
import FlipMove from 'react-flip-move'
import { getCurrentRole } from 'utils/storeQueries'

class Users extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchUsers())
  }

  renderUser(user) {
    const name = [user.attributes.first_name, user.attributes.last_name].join(' ')

    return (
      <Link
        className="ItemRow"
        activeClassName="ItemRow--active"
        to={`/admin/users/${user.id}/edit`}
        key={user.id}
      >
        <div className="ItemRow__item">
          <div className="ItemRow__item__inner">
            <div className="ItemRow__item__image">
              <Avatar user={user} size={70} />
            </div>
            <div className="ItemRow__item__content">
              <div className="ItemRow__item__title">
                {name}
                <span className="ItemRow__item__title__tag">
                  {user.attributes.state}
                </span>
              </div>
              <div className="ItemRow__item__details">
                {user.attributes.email}
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
            <img src="/assets/images/user.svg" alt="Users" />
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

  renderUsers() {
    const { users } = this.props

    return (
      <div className="Items">
        {
          users.length > 0 ?
            <div className="Items__items">
              <FlipMove
                staggerDelayBy={20}
                enterAnimation="accordionVertical"
                leaveAnimation="accordionVertical"
              >
                {users.map(this.renderUser.bind(this))}
              </FlipMove>
            </div> :
            this.renderBlankSlate()
        }
        <Link
          className="Items__button"
          to="/admin/users/new"
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
            this.props.users ?
              this.renderUsers() :
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

Users.propTypes = {
  dispatch: PropTypes.func.isRequired,
  users: PropTypes.array,
  canManageUsers: PropTypes.bool,
  children: PropTypes.element,
}

function mapStateToProps(state) {
  const users = Object.values(state.users)
    .sort((a, b) => a.attributes.last_name.localeCompare(b.attributes.last_name))

  const role = getCurrentRole(state)
  const canManageUsers = role.attributes.can_manage_users

  return { users, canManageUsers }
}

export default connect(mapStateToProps)(Users)
