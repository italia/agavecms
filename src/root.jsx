import 'babel-polyfill'
import 'core-js/modules/es7.object.values'

import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'

import EntryPoint from 'components/EntryPoint'
import store from 'store'

import updateColors from 'sideEffects/updateColors'

store.subscribe(() => {
  updateColors(store)
})

const root = (
  <Provider store={store}>
    <EntryPoint />
  </Provider>
)

const rootElement = document.getElementById('root')

ReactDom.render(root, rootElement)
