import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import { create as createUser } from 'actions/users'
import generateEmptyUser from 'utils/generateEmptyUser'
import UserForm from 'components/sub/UserForm'
import { alert, notice } from 'actions/notifications'
import convertToFormErrors from 'utils/convertToFormErrors'
import { FormattedMessage } from 'react-intl'

class NewUser extends Component {
  handleSubmit(user) {
    const { dispatch } = this.props

    return dispatch(createUser({ data: user }))
      .then(({ data }) => {
        dispatch(notice(this.t('editor.editor.create.success')))
        this.pushRoute(`/admin/users/${data.id}/edit`)
      })
      .catch((error) => {
        dispatch(alert(this.t('editor.editor.create.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  render() {
    const user = generateEmptyUser()

    return (
      <div className="Page">
        <div className="Page__inner">
          <div className="Page__header">
            <div className="Page__title">
              <FormattedMessage id="form.newEditorForm.title" />
            </div>
          </div>
          <div className="Page__content">
            <UserForm user={user} onSubmit={this.handleSubmit.bind(this)} />
          </div>
        </div>
      </div>
    )
  }
}

NewUser.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object,
}

function mapStateToProps(state, props) {
  const user = state.users[props.userId]

  return { user }
}

export default connect(mapStateToProps)(NewUser)
