import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

function Username({ prefix, name }) {
  return name ?
    <span>{ (prefix || '') + name }</span> :
    null
}

Username.propTypes = {
  name: PropTypes.string,
  prefix: PropTypes.string,
}

function mapStateToProps(state, props) {
  const { userLink } = props

  let user
  let name

  if (userLink.data && userLink.data.type === 'account') {
    name = 'Administrator'
  } else if (userLink.data && userLink.data.type === 'user') {
    user = state.users[userLink.data.id]
    name = user ?
      `${user.attributes.first_name} ${user.attributes.last_name}` :
      `User #${userLink.data.id}`
  }

  return { name }
}

export default connect(mapStateToProps)(Username)
