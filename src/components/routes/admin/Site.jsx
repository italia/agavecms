import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import { alert, notice } from 'actions/notifications'
import SiteForm from 'components/sub/SiteForm'
import convertToFormErrors from 'utils/convertToFormErrors'
import {
  update as updateSite,
  fetch as getSite,
} from 'actions/site'
import { FormattedMessage } from 'react-intl'

class Settings extends Component {
  handleSubmit(site) {
    const { dispatch } = this.props

    return dispatch(updateSite({ data: site }))
      .then(() => {
        const include = [
          'item_types',
          'item_types.singleton_item',
        ].join(',')
        return dispatch(getSite({ force: true, query: { include } }))
      })
      .then(() => {
        dispatch(notice(this.t('admin.site.update.success')))

        const include = [
          'item_types',
          'item_types.singleton_item',
        ].join(',')

        dispatch(getSite({ force: true, query: { include } }))
      })
      .catch((error) => {
        dispatch(alert(this.t('admin.site.update.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  renderLoading() {
    return <div>...</div>
  }

  renderForm() {
    const { site } = this.props

    return (
      <SiteForm
        locales={site.attributes.locales}
        site={site}
        onSubmit={this.handleSubmit.bind(this)}
      />
    )
  }

  render() {
    const { site } = this.props

    return (
      <div className="Page">
        <div className="Page__inner">
          <div className="Page__header">
            <div className="Page__title">
              <FormattedMessage id="adminArea.splitPane.siteSettings" />
            </div>
          </div>
          <div className="Page__content">
            {
              site ?
                this.renderForm() :
                this.renderLoading()
            }
          </div>
        </div>
      </div>
    )
  }
}

Settings.propTypes = {
  dispatch: PropTypes.func.isRequired,
  site: PropTypes.object,
}

function mapStateToProps(state) {
  const site = state.site
  return { site }
}

export default connect(mapStateToProps)(Settings)
