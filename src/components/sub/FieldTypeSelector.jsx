import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'

const groups = [
  {
    name: 'text',
    types: ['string', 'text'],
  },
  {
    name: 'rich_text',
    types: ['rich_text'],
  },
  {
    name: 'media',
    types: ['image', 'file', 'gallery', 'video'],
  },
  {
    name: 'datetime',
    types: ['date', 'date_time'],
  },
  {
    name: 'number',
    types: ['integer', 'float'],
  },
  {
    name: 'boolean',
    types: ['boolean'],
  },
  {
    name: 'location',
    types: ['lat_lon'],
  },
  {
    name: 'color',
    types: ['color'],
  },
  {
    name: 'seo',
    types: ['slug', 'seo'],
  },
  {
    name: 'reference',
    types: ['link', 'links'],
  },
]

class FieldTypeSelector extends Component {
  constructor(props) {
    super(props)
    this.state = { selectedGroup: null }
  }

  handleSelectFieldType(fieldType, e) {
    e.preventDefault()
    this.props.onSelect(fieldType)
  }

  handleSelectGroup(i, e) {
    e.preventDefault()
    const group = groups[i]

    if (i === null || group.types.length > 1) {
      this.setState({ selectedGroup: i })
    } else {
      this.props.onSelect(group.types[0])
    }
  }

  renderFieldType(fieldType) {
    return (
      <a
        key={fieldType}
        href="#"
        onClick={this.handleSelectFieldType.bind(this, fieldType)}
        className="FieldTypeSelector__field"
      >
        <div className="FieldTypeSelector__field__label">
          {this.t(`fieldType.${fieldType}`)}
        </div>
        <div className="FieldTypeSelector__field__description">
          {this.t(`fieldTypeHint.${fieldType}`)}
        </div>
      </a>
    )
  }

  renderGroupFieldTypes() {
    const group = groups[this.state.selectedGroup]

    return (
      <div className="FieldTypeSelector">
        <div className="FieldTypeSelector__fields">
          <div className="FieldTypeSelector__fields__group">
            <div className="FieldTypeSelector__group">
              <div className="FieldTypeSelector__group__icon">
                <i className={`icon--fieldgroup-${group.name}`} />
              </div>
              <div className="FieldTypeSelector__group__label">
                {this.t(`fieldGroup.${group.name}.title`)}
              </div>
            </div>
            <a
              href="#"
              onClick={this.handleSelectGroup.bind(this, null)}
              className="FieldTypeSelector__fields__group__back"
            >
              &laquo; Change field type
            </a>
          </div>
          <div className="FieldTypeSelector__fields__items">
            {group.types.map(this.renderFieldType.bind(this))}
          </div>
        </div>
      </div>
    )
  }

  renderGroup(group, index) {
    return (
      <div className="FieldTypeSelector__group" key={group.name}>
        <a
          key={group.name}
          href="#"
          onClick={this.handleSelectGroup.bind(this, index)}
          className="FieldTypeSelector__group__icon"
        >
          <i className={`icon--fieldgroup-${group.name}`} />
        </a>
        <div className="FieldTypeSelector__group__label">
          {this.t(`fieldGroup.${group.name}.title`)}
        </div>
        <div className="FieldTypeSelector__group__description">
          {this.t(`fieldGroup.${group.name}.description`)}
        </div>
      </div>
    )
  }

  renderGroups() {
    return (
      <div className="FieldTypeSelector__groups">
        {groups.map(this.renderGroup.bind(this))}
      </div>
    )
  }

  render() {
    return this.state.selectedGroup === null ?
      this.renderGroups() :
      this.renderGroupFieldTypes()
  }
}

FieldTypeSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
}

export default FieldTypeSelector
