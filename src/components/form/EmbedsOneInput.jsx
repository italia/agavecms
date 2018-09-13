import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import EmbedsManyInput from 'components/form/EmbedsManyInput'

class EmbedsOneInput extends Component {
  handleBlur(value) {
    this.props.onBlur(value[0] || null)
  }

  render() {
    const { value } = this.props
    return (
      <EmbedsManyInput
        {...this.props}
        value={value ? [value] : []}
        onBlur={this.handleBlur.bind(this)}
        sortingEnabled={false}
        limit={1}
      />
    )
  }
}

EmbedsOneInput.propTypes = {
  value: PropTypes.string,
  onBlur: PropTypes.func,
}

export default EmbedsOneInput
