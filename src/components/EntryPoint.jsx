import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { IntlProvider, addLocaleData } from 'react-intl'
import { Router, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { DragDropContext as dragDropContext } from 'react-dnd'
import dndBackend from 'react-dnd-html5-backend'
import store from 'store'

import routes from 'routes'
import it from 'react-intl/locale-data/it'
import itMessages from 'locales/it'

addLocaleData(it)

const messages = {
  it: itMessages
}

const history = syncHistoryWithStore(browserHistory, store)

class EntryPoint extends Component {
  render() {
    const { locale } = this.props

    return (
      <IntlProvider
        locale={locale}
        messages={messages[locale]}
      >
        <div>
          <Router history={history}>
            {routes}
          </Router>
        </div>
      </IntlProvider>
    )
  }
}

EntryPoint.propTypes = {
  dispatch: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
}

function mapStateToProps(state) {
  return { locale: state.ui.locale }
}

EntryPoint.contextTypes = Object.assign(
  {},
  Component.contextType,
  { router: React.PropTypes.object }
)

export default dragDropContext(dndBackend)(
  connect(mapStateToProps)(
    EntryPoint
  )
)
