import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import cloneDeep from 'deep-clone'
import {
  fetch as fetchUser,
  update as updateUser,
  destroy as destroyUser,
} from 'actions/users'
import UserForm from 'components/sub/UserForm'
import { alert, notice } from 'actions/notifications'
import convertToFormErrors from 'utils/convertToFormErrors'
import { FormattedMessage } from 'react-intl'

class EditUser extends Component {
  componentDidMount() {
    const { dispatch, params } = this.props
    dispatch(fetchUser({ id: params.userId }))
  }

  handleSubmit(user) {
    const { dispatch } = this.props

    const payload = cloneDeep(user)

    return dispatch(updateUser({ id: user.id, data: payload }))
      .then(() => {
        dispatch(notice(this.t('editor.editor.update.success')))
      })
      .catch((error) => {
        dispatch(alert(this.t('editor.editor.update.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  handleDestroy(e) {
    const { dispatch, user } = this.props

    e.preventDefault()

    if (!confirm(this.t('messages.areyousure'))) {
      return
    }

    dispatch(destroyUser({ id: user.id }))
      .then(() => {
        dispatch(notice(this.t('editor.editor.destroy.success')))
        this.pushRoute('/admin/users')
      })
      .catch(() => {
        dispatch(alert(this.t('editor.editor.destroy.failure')))
      })
  }

  render() {
    const { user, isCurrentUser } = this.props

    return (
      <div className="Page">
        <div className="Page__inner">
          <div className="Page__header">
            <div className="Page__title">
              <FormattedMessage id="form.editEditorForm.title" />
            </div>
            <div className="Page__space" />
            {
              user && !isCurrentUser &&
                <a
                  href="#"
                  onClick={this.handleDestroy.bind(this)}
                  className="Page__action--delete"
                >
                  <i className="icon--delete" />
                  <span><FormattedMessage id="form.editEditorForm.delete" /></span>
                </a>
            }
          </div>
          <div className="Page__content">
            {
              user &&
                <UserForm user={user} onSubmit={this.handleSubmit.bind(this)} />
            }
          </div>
        </div>
      </div>
    )
  }
}

EditUser.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object,
  isCurrentUser: PropTypes.bool,
  params: PropTypes.object.isRequired,
}

function mapStateToProps(state, props) {
  const user = state.users[props.params.userId]
  const isCurrentUser = state.session.userType === 'user' &&
    state.session.userId === props.params.userId

  return { user, isCurrentUser }
}

export default connect(mapStateToProps)(EditUser)
