import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import Picker from 'react-color/lib/components/sketch/Sketch'
import enhanceWithClickOutside from 'react-click-outside'
import { connect } from 'react-redux'
import { setPreviewThemeColor } from 'actions/ui'

class ColorInput extends Component {
  constructor(props) {
    super(props)
    this.state = { isOpen: false }
  }

  handleOpen() {
    this.setState({ isOpen: true })
  }

  handleClickOutside() {
    this.setState({ isOpen: false })
  }

  handleClear() {
    this.props.onChange(null)
  }

  handleChange(value) {
    const convertedColor = {
      red: value.rgb.r,
      green: value.rgb.g,
      blue: value.rgb.b,
      alpha: Math.round(value.rgb.a * 255),
    }

    if (this.props.dispatchUi) {
      this.props.dispatch(setPreviewThemeColor({
        name: this.props.dispatchUi,
        value: convertedColor,
      }))
    }

    this.props.onChange(convertedColor)
  }

  render() {
    const { value: outsideValue, enableAlpha, presetColors, disabled } = this.props

    const value = outsideValue && {
      r: outsideValue.red,
      g: outsideValue.green,
      b: outsideValue.blue,
      a: outsideValue.alpha / 255.0,
    }

    const cssColor = value &&
      `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`

    const className = ['ColorInput']

    if (disabled) {
      className.push('is-disabled')
    }

    return (
      <div className={className.join(' ')}>
        <div className="ColorInput__color">
          {
            value &&
              <div className="ColorInput__value" onClick={this.handleOpen.bind(this)}>
                <div
                  className="ColorInput__inner-value"
                  style={{ backgroundColor: cssColor }}
                />
              </div>
          }
          {
            value && !disabled &&
              <div className="ColorInput__clear" onClick={this.handleClear.bind(this)}>
                <i className="icon--cross" />
              </div>
          }
          {
            !value &&
              <div className="ColorInput__no-value" onClick={this.handleOpen.bind(this)}>
                No color set
              </div>
          }
        </div>
        {
          this.state.isOpen && !disabled &&
            <div className="ColorInput__pane">
              <Picker
                onChangeComplete={this.handleChange.bind(this)}
                presetColors={presetColors ? presetColors.filter(x => x) : []}
                color={value || '#000000'}
                disableAlpha={!enableAlpha}
              />
            </div>
        }
      </div>
    )
  }
}

ColorInput.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  enableAlpha: PropTypes.bool,
  dispatchUi: PropTypes.string,
  presetColors: PropTypes.array,
  disabled: PropTypes.bool,
  dispatch: PropTypes.func,
}

ColorInput.defaultProps = {
  enableAlpha: false,
}

export default connect()(enhanceWithClickOutside(ColorInput))
