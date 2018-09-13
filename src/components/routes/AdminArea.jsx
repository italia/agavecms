import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import Link from 'components/sub/Link'
import SplitPane from 'react-split-pane'
import { erdUrl } from 'api/agave'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { getCurrentRole } from 'utils/storeQueries'

class AdminArea extends Component {
  downloadErd(e) {
    e.stopPropagation()
    e.preventDefault()

    document.location = erdUrl()
  }
  render() {
    const { role, hasItemTypes } = this.props

    return (
      <SplitPane minSize={200} defaultSize={250} split="vertical">
        <ul className="ItemTypesBar">
          {
            role.can_edit_schema &&
              <li className="ItemTypesBar__item">
                <Link
                  className="ItemTypesBar__item__link ItemTypesBar__item__link--level-0"
                  activeClassName="ItemTypesBar__item__link--active"
                  to="/admin/item_types"
                >
                  <FormattedMessage id="adminArea.splitPane.itemTypes" />
                  {
                    hasItemTypes &&
                      <span
                        className="ItemTypesBar__item__link__icon"
                        onClick={this.downloadErd.bind(this)}
                      >
                        <i className="icon--download" />
                      </span>
                  }
                </Link>
              </li>
          }
          {
            role.can_edit_schema && hasItemTypes &&
              <li className="ItemTypesBar__item">
                <Link
                  className="ItemTypesBar__item__link ItemTypesBar__item__link--level-0"
                  activeClassName="ItemTypesBar__item__link--active"
                  to="/admin/menu_items"
                >
                  <FormattedMessage id="adminArea.splitPane.menuSettings" />
                </Link>
              </li>
          }
          {
            role.can_edit_site && role.can_import_and_export &&
              <li className="ItemTypesBar__item">
                <Link
                  className="ItemTypesBar__item__link ItemTypesBar__item__link--level-0"
                  activeClassName="ItemTypesBar__item__link--active"
                  to="/admin/import_site"
                >
                  <FormattedMessage id="adminArea.splitPane.importSiteSettings" />
                </Link>
              </li>
          }
          {
            role.can_edit_site &&
              <li className="ItemTypesBar__item">
                <Link
                  className="ItemTypesBar__item__link ItemTypesBar__item__link--level-0"
                  activeClassName="ItemTypesBar__item__link--active"
                  to="/admin/site"
                >
                  <FormattedMessage id="adminArea.splitPane.siteSettings" />
                </Link>
              </li>
          }
          {
            role.can_manage_users &&
              <li className="ItemTypesBar__item">
                <Link
                  to="/admin/users"
                  className="ItemTypesBar__item__link ItemTypesBar__item__link--level-0"
                  activeClassName="NavigationBar__button--active"
                >
                  <FormattedMessage id="adminArea.splitPane.manageEditors" />
                </Link>
              </li>
          }
          {
            role.can_manage_users &&
              <li className="ItemTypesBar__item">
                <Link
                  to="/admin/roles"
                  className="ItemTypesBar__item__link ItemTypesBar__item__link--level-0"
                  activeClassName="NavigationBar__button--active"
                >
                  <FormattedMessage id="adminArea.splitPane.manageRoles" />
                </Link>
              </li>
          }
          {
            role.can_edit_site &&
              <li className="ItemTypesBar__item">
                <Link
                  className="ItemTypesBar__item__link ItemTypesBar__item__link--level-0"
                  activeClassName="ItemTypesBar__item__link--active"
                  to="/admin/deployment"
                >
                  <FormattedMessage id="adminArea.splitPane.deploymentSettings" />
                </Link>
              </li>
          }
          {
            role.can_edit_site &&
              <li className="ItemTypesBar__item">
                <Link
                  className="ItemTypesBar__item__link ItemTypesBar__item__link--level-0"
                  activeClassName="ItemTypesBar__item__link--active"
                  to="/admin/logs"
                >
                  <FormattedMessage id="adminArea.splitPane.deploymentLogs" />
                </Link>
              </li>
          }
          {
            role.can_edit_site && role.can_manage_access_tokens &&
              <li className="ItemTypesBar__item">
                <Link
                  className="ItemTypesBar__item__link ItemTypesBar__item__link--level-0"
                  activeClassName="ItemTypesBar__item__link--active"
                  to="/admin/access_tokens"
                >
                  <FormattedMessage id="adminArea.splitPane.apiTokens" />
                </Link>
              </li>
          }
        </ul>
        <div className="wrap">
          {this.props.children}
        </div>
      </SplitPane>
    )
  }
}

AdminArea.propTypes = {
  children: PropTypes.element,
  hasItemTypes: PropTypes.bool,
  role: PropTypes.object,
}

function mapStateToProps(state) {
  const hasItemTypes = Object.values(state.itemTypes).length > 0
  const role = getCurrentRole(state)
  return { hasItemTypes, role: (role ? role.attributes : {}) }
}

export default connect(mapStateToProps)(AdminArea)
