import createAsyncAction from 'utils/createAsyncAction'
import getQuoteOfDay from 'api/getQuoteOfDay'

/* eslint-disable import/prefer-default-export */
export const fetch = createAsyncAction(
  'quoteOfDay/fetch',
  getQuoteOfDay,
  (options, getState) => {
    const { ui } = getState()

    if (ui.quoteOfDay) {
      return Promise.resolve({ data: ui.quoteOfDay })
    }

    return undefined
  }
)
/* eslint-enable import/prefer-default-export */
