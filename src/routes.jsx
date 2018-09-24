import React from 'react'
import { Route, IndexRoute, IndexRedirect } from 'react-router'

import store from 'store'

import App from 'components/routes/App'
import Backend from 'components/routes/Backend'
import NoAuth from 'components/routes/NoAuth'
import AdminArea from 'components/routes/AdminArea'
import EditorArea from 'components/routes/EditorArea'
import MediaArea from 'components/routes/MediaArea'
import SignIn from 'components/routes/noAuth/SignIn'
import AutoSignIn from 'components/routes/noAuth/AutoSignIn'
import CompleteRegistration from 'components/routes/noAuth/CompleteRegistration'
import RequestPasswordReset from 'components/routes/noAuth/RequestPasswordReset'
import ResetPassword from 'components/routes/noAuth/ResetPassword'
import Dashboard from 'components/routes/editor/Dashboard'
import Items from 'components/routes/editor/Items'
import Users from 'components/routes/admin/Users'
import NewUser from 'components/routes/admin/NewUser'
import EditUser from 'components/routes/admin/EditUser'
import Item from 'components/routes/editor/Item'
import EditItem from 'components/routes/editor/EditItem'
import Settings from 'components/routes/editor/Settings'
import EditMenuItems from 'components/routes/admin/EditMenuItems'
import ImportSite from 'components/routes/admin/ImportSite'
import ItemTypes from 'components/routes/admin/ItemTypes'
import ItemType from 'components/routes/admin/ItemType'
import Site from 'components/routes/admin/Site'
import DeploymentEnvironment from 'components/routes/admin/DeploymentEnvironment'
import DeploymentEnvironments from 'components/routes/admin/DeploymentEnvironments'
import DeploymentLogs from 'components/routes/admin/DeploymentLogs'
import AccessTokens from 'components/routes/admin/AccessTokens'
import NewAccessToken from 'components/routes/admin/NewAccessToken'
import EditAccessToken from 'components/routes/admin/EditAccessToken'
import Roles from 'components/routes/admin/Roles'
import NewRole from 'components/routes/admin/NewRole'
import EditRole from 'components/routes/admin/EditRole'
import NoMatch from 'components/routes/NoMatch'

const requireAuth = (nextState, replace) => {
  if (!store.getState().session.bearerToken) {
    replace({
      pathname: '/',
      query: { nextPathname: nextState.location.pathname },
    })
  }
}

const requireNoAuth = (nextState, replace) => {
  if (store.getState().session.bearerToken) {
    replace('/editor')
  }
}

const routes = (
  <Route path="/" component={App}>
    <Route component={Backend} onEnter={requireAuth}>
      <Route path="editor" component={EditorArea}>
        <IndexRoute component={Dashboard} />
        <Route path="item_types/:itemTypeId/items" component={Items}>
          <Route path="new" component={Item}>
            <IndexRoute component={EditItem} />
          </Route>
          <Route path=":itemId" component={Item}>
            <Route path="edit" component={EditItem} />
          </Route>
        </Route>
        <Route path="settings" component={Settings} />
      </Route>
      <Route path="media" component={MediaArea} />
      <Route path="admin" component={AdminArea}>
        <IndexRedirect to="/admin/item_types" />
        <Route path="menu_items" component={EditMenuItems} />
        <Route path="item_types" component={ItemTypes}>
          <Route path=":itemTypeId" component={ItemType} />
        </Route>
        <Route path="import_site" component={ImportSite} />
        <Route path="users" component={Users}>
          <Route path=":userId/edit" component={EditUser} />
          <Route path="new" component={NewUser} />
        </Route>
        <Route path="roles" component={Roles}>
          <Route path=":roleId/edit" component={EditRole} />
          <Route path="new" component={NewRole} />
        </Route>
        <Route path="site" component={Site} />
        <Route path="deployment" component={DeploymentEnvironments}>
          <Route path=":environmentId" component={DeploymentEnvironment} />
        </Route>
        <Route path="logs" component={DeploymentLogs} />
        <Route path="access_tokens" component={AccessTokens}>
          <Route path=":accessTokenId/edit" component={EditAccessToken} />
          <Route path="new" component={NewAccessToken} />
        </Route>
      </Route>
    </Route>
    <Route component={NoAuth} onEnter={requireNoAuth}>
      <Route path="complete_registration" component={CompleteRegistration} />
      <Route path="request_password_reset" component={RequestPasswordReset} />
      <Route path="reset_password" component={ResetPassword} />
      <Route path="sign_in" component={SignIn} />
    </Route>
    <Route path="enter" component={AutoSignIn} />
    <IndexRedirect to="/sign_in" />
    <Route path="*" component={NoMatch} />
  </Route>
)

export default routes
