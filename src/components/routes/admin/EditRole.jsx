import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import cloneDeep from 'deep-clone'
import {
  fetch as fetchRole,
  update as updateRole,
  destroy as destroyRole,
} from 'actions/roles'
import RoleForm from 'components/sub/RoleForm'
import { alert, notice } from 'actions/notifications'
import convertToFormErrors from 'utils/convertToFormErrors'
import { FormattedMessage } from 'react-intl'

class EditRole extends Component {
  componentDidMount() {
    const { dispatch, params } = this.props
    dispatch(fetchRole({ id: params.roleId }))
  }

  handleSubmit(role) {
    const { dispatch } = this.props

    const payload = cloneDeep(role)

    return dispatch(updateRole({ id: role.id, data: payload }))
      .then(() => {
        dispatch(notice(this.t('editor.role.update.success')))
      })
      .catch((error) => {
        dispatch(alert(this.t('editor.role.update.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  handleDestroy(e) {
    const { dispatch, role } = this.props

    e.preventDefault()

    if (!confirm(this.t('messages.areyousure'))) {
      return
    }

    dispatch(destroyRole({ id: role.id }))
      .then(() => {
        dispatch(notice(this.t('editor.role.destroy.success')))
        this.pushRoute('/admin/roles')
      })
      .catch(() => {
        dispatch(alert(this.t('editor.role.destroy.failure')))
      })
  }

  render() {
    const { role } = this.props

    return (
      <div className="Page">
        <div className="Page__inner">
          <div className="Page__header">
            <div className="Page__title">
              <FormattedMessage id="form.editRoleForm.title" />
            </div>
            <div className="Page__space" />
            {
              role &&
                <a
                  href="#"
                  onClick={this.handleDestroy.bind(this)}
                  className="Page__action--delete"
                >
                  <i className="icon--delete" />
                  <span><FormattedMessage id="form.editRoleForm.delete" /></span>
                </a>
            }
          </div>
          <div className="Page__content">
            {
              role &&
                <RoleForm role={role} onSubmit={this.handleSubmit.bind(this)} />
            }
          </div>
        </div>
      </div>
    )
  }
}

EditRole.propTypes = {
  dispatch: PropTypes.func.isRequired,
  role: PropTypes.object,
  params: PropTypes.object.isRequired,
}

function mapStateToProps(state, props) {
  const role = state.roles[props.params.roleId]

  return { role }
}

export default connect(mapStateToProps)(EditRole)
