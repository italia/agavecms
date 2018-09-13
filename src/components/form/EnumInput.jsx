import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { SelectInput } from 'components/form'

class EnumInput extends Component {
  render() {
    const { values } = this.props

    const options = values.map(value => (
      { label: value, value }
    ))

    return (
      <SelectInput
        {...this.props}
        options={options}
      />
    )
  }
}

EnumInput.propTypes = {
  values: PropTypes.array,
}

export default EnumInput
