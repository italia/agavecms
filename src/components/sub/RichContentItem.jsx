import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { Field } from 'components/form'
import { inputForFieldType } from 'utils/fieldTypes'
import { connect } from 'react-redux'
import { getFieldsForItemType } from 'utils/storeQueries'
import { formValueSelector } from 'redux-form'
import ChooseItemTypeButton from 'components/sub/ChooseItemTypeButton'

class RichContentItem extends Component {
  handleRemoveClick(e) {
    e.preventDefault()
    this.props.onRemove()
  }

  handleMoveUpClick(e) {
    e.preventDefault()
    this.props.onMoveUp()
  }

  handleMoveDownClick(e) {
    e.preventDefault()
    this.props.onMoveDown()
  }

  handleInsertItem(itemType, fields, index) {
    this.props.onInsert(itemType, fields, index)
  }

  renderField(showLabel, { name, field }) {
    const { fields, locale, disabled } = this.props
    const attributes = fields.find(f => f.id === field.id).attributes

    const props = {
      name,
      // showErrorsIfUntouched: !isNewItem,
      key: name,
      showLabel,
      label: attributes.label,
      hint: attributes.hint,
      required: !!attributes.validators.required,
      validators: attributes.validators,
    }

    return (
      <Field {...props}>
        {
          inputForFieldType({
            locale,
            disabled,
            fieldName: name,
            fieldType: attributes.field_type,
            appeareance: attributes.appeareance,
            validators: attributes.validators,
          })
        }
      </Field>
    )
  }

  render() {
    const { disabled, fields, name, itemType, canMoveUp, canMoveDown } = this.props

    const localizedFields = fields
    .filter(field => field.attributes.localized)
    .map(field => field.attributes.label)

    if (localizedFields.length > 0) {
      return (
        <div className="RichContentItem RichContentItem--big">
          <div className="RichContentItem__content">
            <strong>Configurazione errata:</strong> "{itemType.attributes.name}"
            cannot be used as a rich-text building block as it contains
            the following localized fields: { localizedFields.join(', ')}.
          </div>
        </div>
      )
    }

    const fieldsToRender = fields
    .sort((a, b) => a.attributes.position - b.attributes.position)
    .map(field => ({ name: `${name}.${field.attributes.api_key}`, field }))

    const className = ['RichContentItem']

    if (fieldsToRender.length > 1) {
      className.push('RichContentItem--big')
    }

    return (
      <div className="RichContentItem RichContentItem--big">
        {
          !disabled &&
            <div className="RichContentItem__handle">
              <i className="icon--dots-vertical" />
              <div className="RichContentItem__menu">
                {
                  canMoveUp &&
                    <a
                      href="#"
                      className="RichContentItem__menu__item"
                      onClick={this.handleMoveUpClick.bind(this)}
                    >
                      Move up
                    </a>
                }
                {
                  canMoveDown &&
                    <a
                      href="#"
                      className="RichContentItem__menu__item"
                      onClick={this.handleMoveDownClick.bind(this)}
                    >
                      Move down
                    </a>
                }
                <div className="RichContentItem__menu__item">
                  <ChooseItemTypeButton
                    intlLabel="richText.add"
                    itemTypeIds={this.props.itemTypeIds}
                    onSelect={this.handleInsertItem.bind(this)}
                    menuItem
                  />
                </div>
                <a
                  href="#"
                  className="RichContentItem__menu__item RichContentItem__menu__item--alert"
                  onClick={this.handleRemoveClick.bind(this)}
                >
                  Remove block
                </a>
              </div>
            </div>
        }
        <div className="RichContentItem__content">
          <div className="RichContentItem__header">
            {itemType.attributes.name}
          </div>
          {fieldsToRender.map(this.renderField.bind(this, fieldsToRender.length > 1))}
        </div>
      </div>
    )
  }
}

RichContentItem.propTypes = {
  fields: PropTypes.array.isRequired,
  itemTypeIds: PropTypes.array.isRequired,
  locale: PropTypes.string,
  name: PropTypes.string.isRequired,
  itemType: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
  onInsert: PropTypes.func.isRequired,
  canMoveUp: PropTypes.bool.isRequired,
  canMoveDown: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
}

function mapStateToProps(state, props) {
  const value = formValueSelector(props.form)(state, props.name)
  const itemType = state.itemTypes[value.itemTypeId]
  const fields = getFieldsForItemType(state, itemType)

  return { fields, itemType }
}

export default connect(mapStateToProps)(RichContentItem)
