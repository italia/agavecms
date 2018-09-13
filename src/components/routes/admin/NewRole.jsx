import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import cloneDeep from 'deep-clone'
import { create as createRole } from 'actions/roles'
import generateEmptyRole from 'utils/generateEmptyRole'
import RoleForm from 'components/sub/RoleForm'
import { alert, notice } from 'actions/notifications'
import convertToFormErrors from 'utils/convertToFormErrors'
import { FormattedMessage } from 'react-intl'

class NewRole extends Component {
  handleSubmit(role) {
    const { dispatch } = this.props

    const payload = cloneDeep(role)

    return dispatch(createRole({ data: payload }))
      .then(({ data }) => {
        dispatch(notice(this.t('editor.role.create.success')))
        this.pushRoute(`/admin/roles/${data.id}/edit`)
      })
      .catch((error) => {
        dispatch(alert(this.t('editor.role.create.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  render() {
    const role = generateEmptyRole()

    return (
      <div className="Page">
        <div className="Page__inner">
          <div className="Page__header">
            <div className="Page__title">
              <FormattedMessage id="form.newRoleForm.title" />
            </div>
          </div>
          <div className="Page__content">
            <RoleForm role={role} onSubmit={this.handleSubmit.bind(this)} />
          </div>
        </div>
      </div>
    )
  }
}

NewRole.propTypes = {
  dispatch: PropTypes.func.isRequired,
  role: PropTypes.object,
}

function mapStateToProps(state, props) {
  const role = state.roles[props.roleId]

  return { role }
}

export default connect(mapStateToProps)(NewRole)
