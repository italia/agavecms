import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import ReactSelect from 'react-select'

export default class SelectInput extends Component {
  handleChange(value) {
    const { onChange } = this.props

    if (!onChange) {
      return
    }

    if (Array.isArray(value) && !this.props.multi) {
      onChange(null)
    } else if (Array.isArray(value) && this.props.multi) {
      onChange(value.map(x => x.value))
    } else if (value && value.value) {
      onChange(value.value)
    } else {
      onChange(value)
    }
  }

  handleBlur() {
    if (this.props.onBlur) {
      this.props.onBlur(this.props.value)
    }
  }

  render() {
    return (
      <ReactSelect
        {...this.props}
        onBlurResetsInput={false}
        onBlur={this.handleBlur.bind(this)}
        onChange={this.handleChange.bind(this)}
      />
    )
  }
}

SelectInput.propTypes = {
  multi: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
}
