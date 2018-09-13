import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import GalleryInput from 'components/form/GalleryInput'

class ImageInput extends Component {
  handleBlur(value) {
    this.props.onBlur(value[0] || null)
  }

  render() {
    return (
      <GalleryInput
        {...this.props}
        value={this.props.value ? [this.props.value] : []}
        onBlur={this.handleBlur.bind(this)}
        multiple={false}
      />
    )
  }
}

ImageInput.propTypes = {
  value: PropTypes.object,
  onBlur: PropTypes.func,
}

export default ImageInput
