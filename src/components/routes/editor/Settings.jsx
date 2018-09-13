import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import { alert, notice } from 'actions/notifications'
import SettingsForm from 'components/sub/SettingsForm'
import convertToFormErrors from 'utils/convertToFormErrors'
import { update as updateSite } from 'actions/site'
import { FormattedMessage } from 'react-intl'
import Spinner from 'components/sub/Spinner'
import { getCurrentRole } from 'utils/storeQueries'

class Settings extends Component {
  handleSubmit(site) {
    const { dispatch } = this.props

    return dispatch(updateSite({ data: site }))
      .then(() => {
        dispatch(notice(this.t('editor.site.update.success')))
      })
      .catch((error) => {
        dispatch(alert(this.t('editor.site.update.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  renderForm() {
    const { site } = this.props

    return (
      <SettingsForm
        locales={site.attributes.locales}
        site={site}
        onSubmit={this.handleSubmit.bind(this)}
      />
    )
  }

  renderLoading() {
    return (
      <div>
        <Spinner size={80} />
      </div>
    )
  }

  render() {
    const { site, hasPermission } = this.props

    if (!hasPermission) {
      return (
        <div className="permission-denied">
          <div className="permission-denied__inner">
            <div className="permission-denied__icon">
              <i className="icon--blocked" />
            </div>
            <div className="permission-denied__title">
              {this.t('permissionDenied.title')}
            </div>
            <div className="permission-denied__subtitle">
              {this.t('permissionDenied.subtitle')}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="Page">
        <div className="Page__inner">
          <div className="Page__header">
            <div className="Page__title">
              <FormattedMessage id="section.managePreferences" />
            </div>
          </div>
          {
            site ?
              this.renderForm() :
              this.renderLoading()
          }
        </div>
      </div>
    )
  }
}

Settings.propTypes = {
  dispatch: PropTypes.func.isRequired,
  site: PropTypes.object,
  hasPermission: PropTypes.bool,
}

function mapStateToProps(state) {
  const site = state.site
  const role = getCurrentRole(state)

  return { site, hasPermission: role.attributes.can_edit_favicon }
}

export default connect(mapStateToProps)(Settings)
