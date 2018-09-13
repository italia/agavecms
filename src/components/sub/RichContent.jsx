import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import RichContentItem from 'components/sub/RichContentItem'
import ChooseItemTypeButton from 'components/sub/ChooseItemTypeButton'
import generateEmptyItem from 'utils/generateEmptyItem'

class RichContent extends Component {
  handleItemNew(index, itemType, fields) {
    const { locales } = this.props
    const item = generateEmptyItem(locales, fields, itemType)
    this.props.fields.insert(
      index,
      Object.assign(item.attributes, { itemTypeId: itemType.id })
    )
  }

  handleRemove(index) {
    this.props.fields.remove(index)
  }

  handleMove(from, to) {
    this.props.fields.move(from, to)
  }

  render() {
    const { disabled, limit, fields, form, locale, attributes, itemTypeIds } = this.props

    return (
      <div className="RichContent">
        <p className="RichContent__label">{attributes.label}</p>
        <div className="RichContent__content">
          {
            fields.map((name, index) => {
              return (
                <RichContentItem
                  disabled={disabled}
                  key={index}
                  form={form}
                  name={name}
                  index={index}
                  locale={locale}
                  canMoveUp={index > 0}
                  onMoveUp={this.handleMove.bind(this, index, index - 1)}
                  canMoveDown={index < fields.length - 1}
                  onMoveDown={this.handleMove.bind(this, index, index + 1)}
                  onInsert={this.handleItemNew.bind(this, index)}
                  onRemove={this.handleRemove.bind(this, index)}
                  itemTypeIds={itemTypeIds}
                />
              )
            })
          }
        </div>
        {
          ((!limit || fields.length < limit) && !disabled) &&
            <ChooseItemTypeButton
              intlLabel="richText.add"
              itemTypeIds={itemTypeIds}
              onSelect={this.handleItemNew.bind(this, this.props.fields.length)}
              menuItem={false}
            />
        }
      </div>
    )
  }
}

RichContent.propTypes = {
  form: PropTypes.string.isRequired,
  fields: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  attributes: PropTypes.object.isRequired,
  locales: PropTypes.array.isRequired,
  itemTypeIds: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  limit: PropTypes.number,
}

export default RichContent
