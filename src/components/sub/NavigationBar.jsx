import React, { PropTypes } from 'react'
import Link from 'components/sub/Link'
import Component from 'components/BaseComponent'
import StatusPane from 'components/sub/StatusPane'
import DeployButton from 'components/sub/DeployButton'
import DumpButton from 'components/sub/DumpButton'
import AuthPane from 'components/sub/AuthPane'
import VisitSitePane from 'components/sub/VisitSitePane'
import { FormattedMessage } from 'react-intl'
import imageUrl from 'utils/imageUrl'

class NavigationBar extends Component {
  render() {
    const {
      site,
      showContent,
      currentUser,
      canAccessSettings,
      onLogout,
    } = this.props

    const frontendUrl = site.attributes.production_frontend_url

    const siteName = site && site.attributes.theme.logo ?
      <img
        src={imageUrl(site.attributes.theme.logo)}
        alt={site && site.attributes.name}
      />
      :
      <span>
        {site && site.attributes.name}
      </span>

    return (
      <div className="NavigationBar">
        {
          (!site || !frontendUrl) &&
            <Link
              to="/editor"
              className="NavigationBar__site-name"
            >
              {siteName}
            </Link>
        }
        {
          site && frontendUrl &&
            <div className="NavigationBar__site-name">
              <span className="NavigationBar__site-name__label">
                <Link
                  to="/editor"
                  className="NavigationBar__site-name__link"
                >
                  {siteName}
                </Link>
                <VisitSitePane
                  productionUrl={site.attributes.production_frontend_url}
                />
              </span>
            </div>
        }
        {
          showContent &&
            <Link
              to="/editor"
              className="NavigationBar__button"
              activeClassName="NavigationBar__button--active"
            >
              <span className="NavigationBar__button__label">
                <i className="icon--widgets" />
                <FormattedMessage id="nav.manageItemTypes" />
              </span>
            </Link>
        }
        {
          showContent &&
            <Link
              key="media"
              to="/media"
              className="NavigationBar__button"
              activeClassName="NavigationBar__button--active"
            >
              <span className="NavigationBar__button__label">
                <i className="icon--images" />
                <FormattedMessage id="nav.mediaArea" />
              </span>
            </Link>
        }
        {
          canAccessSettings &&
            <Link
              key="admin"
              to="/admin"
              className="NavigationBar__button"
              activeClassName="NavigationBar__button--active"
            >
              <span className="NavigationBar__button__label">
                <i className="icon--settings" />
                <FormattedMessage id="nav.adminArea" />
              </span>
            </Link>
        }
        <div key="site" className="NavigationBar__space" />
        <StatusPane />
        <DeployButton />
        <DumpButton />
        {
          currentUser &&
            <AuthPane
              user={currentUser}
              onLogout={onLogout}
            />
        }
      </div>
    )
  }
}

NavigationBar.propTypes = {
  currentUser: PropTypes.object,
  onLogout: PropTypes.func.isRequired,
  site: PropTypes.object,
  showContent: PropTypes.bool,
  canAccessSettings: PropTypes.bool,
}

export default NavigationBar
