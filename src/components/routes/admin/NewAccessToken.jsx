import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import { create as createAccessToken } from 'actions/accessTokens'
import generateEmptyAccessToken from 'utils/generateEmptyAccessToken'
import AccessTokenForm from 'components/sub/AccessTokenForm'
import { alert, notice } from 'actions/notifications'
import convertToFormErrors from 'utils/convertToFormErrors'
import { FormattedMessage } from 'react-intl'

class NewAccessToken extends Component {
  handleSubmit(accessToken) {
    const { dispatch } = this.props

    return dispatch(createAccessToken({ data: accessToken }))
      .then(({ data }) => {
        dispatch(notice(this.t('admin.accessToken.create.success')))
        this.pushRoute(`/admin/access_tokens/${data.id}/edit`)
      })
      .catch((error) => {
        dispatch(alert(this.t('admin.accessToken.create.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  render() {
    const accessToken = generateEmptyAccessToken()

    return (
      <div className="Page">
        <div className="Page__inner">
          <div className="Page__header">
            <div className="Page__title">
              <FormattedMessage id="form.newAccessToken.title" />
            </div>
          </div>
          <div className="Page__content">
            <AccessTokenForm
              accessToken={accessToken}
              onSubmit={this.handleSubmit.bind(this)}
            />
          </div>
        </div>
      </div>
    )
  }
}

NewAccessToken.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

export default connect()(NewAccessToken)
