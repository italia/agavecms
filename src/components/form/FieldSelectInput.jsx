import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { SelectInput } from 'components/form'
import { connect } from 'react-redux'
import { fetchAll as getFields } from 'actions/fields'

class FieldSelectInput extends Component {
  componentWillMount() {
    this.fetchFields()
  }

  componentDidMount() {
    this.isComponentMounted = true
  }

  componentWillUnmount() {
    this.isComponentMounted = false
  }

  fetchFields() {
    const { dispatch, itemTypeId } = this.props
    dispatch(getFields({ itemTypeId }))
  }

  handleChange(value) {
    this.props.onChange(value)
  }

  render() {
    const { fields } = this.props
    const options = fields.map(field => {
      return {
        value: field.id,
        label: field.attributes.label,
      }
    })

    return (
      <SelectInput
        {...this.props}
        options={options}
        onChange={this.handleChange.bind(this)}
      />
    )
  }
}

FieldSelectInput.propTypes = {
  itemTypeId: PropTypes.string.isRequired,
  value: PropTypes.string,
  fields: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(state, props) {
  const itemType = state.itemTypes[props.itemTypeId]
  const fields = itemType.relationships.fields.data
    .map(link => link.id)
    .map(id => state.fields[id])
    .filter(field => !!field && field.attributes.field_type === 'string')

  return { fields }
}

export default connect(mapStateToProps)(FieldSelectInput)
