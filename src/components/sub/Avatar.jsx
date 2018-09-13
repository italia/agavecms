import gravatar from 'utils/gravatar'
import ColorHash from 'color-hash'
import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

class Avatar extends Component {
  render() {
    const { user, size } = this.props

    if (!user) {
      return <div className="Avatar" style={{ width: size, height: size }} />
    }

    const name = user.attributes.first_name ?
      [user.attributes.first_name, user.attributes.last_name].join(' ') :
      'Administrator'
    const initials = name.split(/ +/).reduce((acc, w) => acc + w[0].toUpperCase(), '')
    const gravatarUrl = gravatar(user.attributes.email, { s: 70, d: 'blank' })
    const colorHash = new ColorHash({ lightness: 0.5 }).hex(name)

    const style = {
      backgroundColor: colorHash,
      width: size,
      height: size,
      lineHeight: `${size - 2}px`,
      fontSize: `${Math.round(size * 0.4)}px`,
    }

    return (
      <div className="Avatar" style={style}>
        {initials.toUpperCase()}
        <img src={gravatarUrl} alt={name} />
      </div>
    )
  }
}

Avatar.propTypes = {
  user: PropTypes.object.isRequired,
  size: PropTypes.number.isRequired,
}

function mapStateToProps(state, props) {
  if (!props.userLink) {
    return {}
  }

  const userLink = props.userLink

  if (!userLink.data) {
    return { user: null }
  }

  if (userLink.data.type === 'account') {
    return { user: state.accounts[userLink.data.id] }
  }

  return { user: state.users[userLink.data.id] }
}

export default connect(mapStateToProps)(Avatar)

