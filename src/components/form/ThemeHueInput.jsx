import React, { PropTypes } from 'react'
import { SliderInput } from 'components/form'
import Component from 'components/BaseComponent'
import { setPreviewHue } from 'actions/ui'
import { connect } from 'react-redux'

class ThemeHueInput extends Component {
  componentWillUnmount() {
    this.props.dispatch(setPreviewHue({ hue: null }))
  }

  handleChange(hue) {
    this.props.dispatch(setPreviewHue({ hue }))
    this.props.onChange(hue)
  }

  render() {
    return (
      <SliderInput
        min={1}
        max={360}
        value={this.props.value}
        onChange={this.handleChange.bind(this)}
        tipFormatter={null}
      />
    )
  }
}

ThemeHueInput.propTypes = {
  dispatch: PropTypes.func.isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func,
}

export default connect()(ThemeHueInput)

