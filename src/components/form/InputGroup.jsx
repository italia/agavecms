import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'

class InputGroup extends Component {
  render() {
    const { pre, post, className, value } = this.props

    return (
      <div className={`input-group ${className}`}>
        {
          pre &&
            <div className="input-group__addon">
              {pre}
            </div>
        }
        <input
          {...this.props}
          value={value || ''}
        />
        {
          post &&
            <div className="input-group__addon">
              {post}
            </div>
        }
      </div>
    )
  }
}

InputGroup.propTypes = {
  pre: PropTypes.string,
  post: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
}

export default InputGroup
