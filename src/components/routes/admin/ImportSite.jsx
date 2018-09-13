import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import Component from 'components/BaseComponent'
import { alert, notice } from 'actions/notifications'
import ImportSiteForm from 'components/sub/ImportSiteForm'
import convertToFormErrors from 'utils/convertToFormErrors'
import { create as createImportSite } from 'actions/importSite'
import { FormattedMessage } from 'react-intl'
import { importSite as instructions } from 'instructions'
import { jsonUrl } from 'api/agave'

import Instructions from 'components/sub/Instructions'

class ImportSite extends Component {
  downloadJson(e) {
    e.stopPropagation()
    e.preventDefault()

    document.location = jsonUrl()
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }

  handleSubmit(data) {
    const { dispatch } = this.props
    return dispatch(createImportSite({ data }))
      .then(() => {
        dispatch(notice(this.t('admin.importSite.update.success')))
        setTimeout(() => {
          window.document.location.reload();
        }, 2000);
      })
      .catch(error => {
        dispatch(alert(this.t('admin.importSite.update.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  renderForm() {
    return (
      <ImportSiteForm
        onSubmit={(e) => {
          this.setState({ loading: true });
          this.handleSubmit(e);
        }}
      />
    )
  }

  renderLoading() {
    return (
      <div>Loading...</div>
    )
  }

  render() {
    const { loading } = this.state;
    return (
      <div className="Page">
        <div className="Page__inner">
          <div className="Page__header">
            <div className="Page__title">
              <FormattedMessage id="adminArea.splitPane.importSiteSettings" />
            </div>
          </div>
          <div className="Page__content">
            <a
              className="Page__link__icon"
              onClick={this.downloadJson.bind(this)}
            >
              <i className="icon--download-cloud" /> Esporta JSON
            </a>
          </div>
          <div className="Page__content">
            <div className="Page__content--alert">
              <Instructions value={instructions()} />
            </div>
            {
              !loading && this.renderForm()
            }
            {
              loading && this.renderLoading()
            }
          </div>
        </div>
      </div>
    )
  }
}

ImportSite.propTypes = {
  dispatch: PropTypes.func.isRequired,
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
}

function mapStateToProps(state) {
  const site = state.site
  return { site }
}

export default withRouter(connect(mapStateToProps)(ImportSite))
