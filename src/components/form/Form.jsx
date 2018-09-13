import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { FormattedHTMLMessage } from 'react-intl'

export default class Form extends Component {
  render() {
    const { error, children } = this.props
    let code

    if (typeof error === 'string') {
      code = error
    } else if (typeof error === 'object') {
      code = error.id
    }

    return (
      <form {...this.props}>
        {
          code &&
            <div className="form__global-error">
              <FormattedHTMLMessage id={`genericError.${code}`} />
            </div>
        }
        {children}
      </form>
    )
  }
}

Form.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.string,
}
