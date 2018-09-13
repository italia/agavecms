import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import cloneDeep from 'deep-clone'
import {
  fetch as fetchAccessToken,
  update as updateAccessToken,
  destroy as destroyAccessToken,
  regenerateToken as regenerateAccessToken,
} from 'actions/accessTokens'
import AccessTokenForm from 'components/sub/AccessTokenForm'
import { alert, notice } from 'actions/notifications'
import convertToFormErrors from 'utils/convertToFormErrors'
import { FormattedMessage } from 'react-intl'

class EditAccessToken extends Component {
  componentDidMount() {
    const { dispatch, params } = this.props
    dispatch(fetchAccessToken({ id: params.accessTokenId }))
  }

  handleSubmit(accessToken) {
    const { dispatch } = this.props

    const payload = cloneDeep(accessToken)

    return dispatch(updateAccessToken({ id: accessToken.id, data: payload }))
      .then(() => {
        dispatch(notice(this.t('admin.accessToken.update.success')))
      })
      .catch((error) => {
        dispatch(alert(this.t('admin.accessToken.update.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  handleRefreshToken(e) {
    const { dispatch, accessToken } = this.props

    e.preventDefault()

    if (!confirm(this.t('messages.areyousure'))) {
      return
    }

    dispatch(regenerateAccessToken({ id: accessToken.id }))
      .then(() => {
        dispatch(notice(this.t('admin.accessToken.regenerateToken.success')))
      })
      .catch(() => {
        dispatch(alert(this.t('admin.accessToken.regenerateToken.failure')))
      })
  }

  handleDestroy(e) {
    const { dispatch, accessToken } = this.props

    e.preventDefault()

    if (!confirm(this.t('messages.areyousure'))) {
      return
    }

    dispatch(destroyAccessToken({ id: accessToken.id }))
      .then(() => {
        dispatch(notice(this.t('admin.accessToken.destroy.success')))
        this.pushRoute('/admin/access_tokens')
      })
      .catch(() => {
        dispatch(alert(this.t('admin.accessToken.destroy.failure')))
      })
  }

  render() {
    const { accessToken } = this.props

    return (
      <div className="Page">
        <div className="Page__inner">
          <div className="Page__header">
            <div className="Page__title">
              <FormattedMessage id="form.editAccessToken.title" />
            </div>
            <div className="Page__space" />
            <a
              href="#"
              onClick={this.handleRefreshToken.bind(this)}
              className="Page__action"
            >
              <i className="icon--sync" />
              <span><FormattedMessage id="form.editAccessTokenForm.refreshToken" /></span>
            </a>
            {
              accessToken && !accessToken.attributes.hardcoded_type &&
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
          {
            accessToken && accessToken.attributes.hardcoded_type &&
              <div className="Page__content--note">
                This API token is present in every Agave space and cannot be
                edited or deleted.
              </div>
          }
          <div className="Page__content">
            {
              accessToken &&
                <AccessTokenForm
                  accessToken={accessToken}
                  onSubmit={this.handleSubmit.bind(this)}
                />
            }
          </div>
        </div>
      </div>
    )
  }
}

EditAccessToken.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accessToken: PropTypes.object,
  params: PropTypes.object.isRequired,
}

function mapStateToProps(state, props) {
  const accessToken = state.accessTokens[props.params.accessTokenId]

  return { accessToken }
}

export default connect(mapStateToProps)(EditAccessToken)
