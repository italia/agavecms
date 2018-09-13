import React, { PropTypes } from 'react'
import enhanceWithClickOutside from 'react-click-outside'
import Component from 'components/BaseComponent'
import Avatar from 'components/sub/Avatar'
import Link from 'components/sub/Link'
import { FormattedMessage } from 'react-intl'

class AuthPane extends Component {
  constructor(props) {
    super(props)

    this.state = {
      authOpen: false,
    }
  }

  handleToggleAuthDropdown(e) {
    e.preventDefault()
    this.setState({ authOpen: !this.state.authOpen })
  }

  handleClickOutside() {
    this.setState({ authOpen: false })
  }

  render() {
    const { user, onLogout } = this.props

    return (
      <div className="NavigationBar__auth">
        <a
          href="#"
          onClick={this.handleToggleAuthDropdown.bind(this)}
          className="NavigationBar__auth__avatar"
        >
          <Avatar user={user} size={37} />
        </a>
        {
          this.state.authOpen &&
            <div className="NavigationBar__auth__dropdown">
              <Link
                key="profile"
                to={`/admin/users/${user.id}/edit`}
                onClick={this.handleClickOutside.bind(this)}
                className="NavigationBar__auth__dropdown__item"
              >
                <i className="icon--user" />
                  {
                    [
                      user.attributes.first_name,
                      user.attributes.last_name,
                    ].join(' ')
                  }
              </Link>
              <a
                key="logout"
                className="NavigationBar__auth__dropdown__item"
                href="#"
                onClick={onLogout}
              >
                <i className="icon--logout" />
                <FormattedMessage id="nav.logout" />
              </a>
            </div>
        }
      </div>
    )
  }
}

AuthPane.propTypes = {
  user: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
}

export default enhanceWithClickOutside(AuthPane)
