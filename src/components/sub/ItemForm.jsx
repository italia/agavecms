import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import InnerItemForm from 'components/sub/InnerItemForm'
import { validateNewItem, validateItem } from 'api/agave'
import convertToFormErrors from 'utils/convertToFormErrors'
import omit from 'object.omit'
import deepEqual from 'deep-equal'
import Link from 'components/sub/Link'

class ItemForm extends Component {
  handleSubmit(attributes) {
    const items = this.extractItemsFromValues(attributes)
    return this.props.onSubmit(items)
  }

  validateItem({ key, item }) {
    const oldValidationResults = this.oldValidationResults || []

    const oldValidationResult = oldValidationResults.find(el => {
      return el.key === key && deepEqual(el.item, item)
    })

    if (oldValidationResult) {
      return Promise.resolve({ key, item, errors: oldValidationResult.errors })
    }

    const validate = item.id ? validateItem.bind(null, item.id) : validateNewItem

    return validate(item)
      .then(() => ({ key, item, errors: null }))
      .catch((error) => Promise.resolve({ key, item, errors: convertToFormErrors(error, false) }))
  }

  extractItemsFromValues(values) {
    const { fields, item, locales, itemType } = this.props
    const items = []
    const attributes = {}

    fields.forEach(field => {
      const apiKey = field.attributes.api_key

      function pushItem(prefix, deepValues, index) {
        items.push({
          key: `${prefix}.${index}`,
          item: {
            id: deepValues.itemId,
            type: 'item',
            relationships: {
              item_type: {
                data: { type: 'item_type', id: deepValues.itemTypeId },
              },
            },
            attributes: omit(deepValues, ['itemId', 'itemTypeId']),
          },
        })
      }

      if (field.attributes.field_type === 'rich_text') {
        if (!field.attributes.localized) {
          values[apiKey].forEach(pushItem.bind(null, apiKey))
          attributes[apiKey] = []
        } else {
          attributes[apiKey] = {}
          locales.forEach((locale) => {
            values[apiKey][locale].forEach(pushItem.bind(null, `${apiKey}.${locale}`))
            attributes[apiKey][locale] = []
          })
        }
      } else {
        attributes[apiKey] = values[apiKey]
      }
    })

    items.push({
      key: null,
      item: {
        id: item.id,
        type: 'item',
        relationships: {
          item_type: {
            data: { type: 'item_type', id: itemType.id },
          },
        },
        attributes,
      },
    })

    return items
  }

  handleAsyncValidate(attributes) {
    const items = this.extractItemsFromValues(attributes)

    return Promise.all(items.map(this.validateItem.bind(this)))
      .then(results => {
        this.oldValidationResults = results

        const itemErrors = results.find(({ key }) => !key).errors || {}

        results
          .filter(({ key }) => key)
          .forEach(({ key, errors }) => {
            const [attr, index] = key.split('.')
            if (errors) {
              itemErrors[attr] = itemErrors[attr] || []
              itemErrors[attr][index] = errors
            }
          })

        if (Object.keys(itemErrors).length > 0) {
          return Promise.reject(itemErrors)
        }

        return null
      })
  }

  buildRawFields() {
    const { locales, fields } = this.props
    const iterator = []

    fields
    .sort((a, b) => a.attributes.position - b.attributes.position)
    .forEach(field => {
      if (field.attributes.localized) {
        locales.forEach(locale => (
          iterator.push({ key: `${field.attributes.api_key}.${locale}`, field, locale })
        ))
      } else {
        iterator.push({ key: field.attributes.api_key, field, locale: null })
      }
    })

    return iterator
  }

  render() {
    const {
      locales,
      item,
      fields,
      form,
      deepItems,
      itemType,
      disabled,
    } = this.props

    if (fields.length === 0) {
      return (
        <div className="blank-slate">
          <p className="blank-slate__title">
            {this.t('admin.item.noFields.title')}
          </p>
          <p className="blank-slate__description">
            {this.t('admin.item.noFields.description')}
          </p>
          <Link
            to={`/admin/item_types/${itemType.id}`}
            className="button button--large button--primary"
          >
            <span>{this.t('admin.item.noFields.button')}</span>
          </Link>
        </div>
      )
    }

    const rawFields = this.buildRawFields()

    const fieldAttributes = {}
    rawFields.forEach(({ key, field }) => {
      fieldAttributes[key] = field.attributes
    })

    const fieldsByLocale = locales
      .reduce((acc, locale) => Object.assign(acc, { [locale]: [] }), {})

    rawFields.forEach(({ key, locale }) => {
      if (locale) {
        fieldsByLocale[locale].push(key)
      } else {
        locales.forEach(l => fieldsByLocale[l].push(key))
      }
    })

    const localized = rawFields.some(({ locale }) => locale)

    const slugFields = {}
    rawFields
      .filter(({ field }) => field.attributes.field_type === 'slug')
      .forEach(({ key, field, locale }) => {
        const titleFieldId = field.attributes.appeareance.title_field_id
        const titleField = fields.find(({ id }) => id === titleFieldId)
        const titleName = titleField.attributes.localized ?
          `${titleField.attributes.api_key}.${locale || locales[0]}` :
          titleField.attributes.api_key

        slugFields[titleName] = key
      })

    function idsToDeepItems(ids) {
      return (ids || []).map(id => {
        const innerItem = deepItems.find(i => i.id === id)
        return Object.assign(
          {
            itemId: innerItem.id,
            itemTypeId: innerItem.relationships.item_type.data.id,
          },
          omit(innerItem.attributes, ['updated_at', 'is_valid'])
        )
      })
    }

    const initialValues = omit(item.attributes, ['updated_at', 'is_valid'])
    fields
      .filter(f => f.attributes.field_type === 'rich_text')
      .forEach(field => {
        const apiKey = field.attributes.api_key

        if (!field.attributes.localized) {
          initialValues[apiKey] = idsToDeepItems(item.attributes[apiKey])
        } else {
          initialValues[apiKey] = {}
          locales.forEach((locale) => {
            initialValues[apiKey][locale] = idsToDeepItems(item.attributes[apiKey][locale])
          })
        }
      })

    return (
      <InnerItemForm
        key={item.id || 'new'}
        form={form}
        isModal={this.props.isModal}
        enableReinitialize
        initialValues={initialValues}
        fieldsByLocale={fieldsByLocale}
        fieldAttributes={fieldAttributes}
        slugFields={slugFields}
        localized={localized}
        isNewItem={!this.props.item.id}
        locales={this.props.locales}
        asyncValidate={this.handleAsyncValidate.bind(this)}
        disabled={disabled}
        onSubmit={this.handleSubmit.bind(this)}
      />
    )
  }
}

ItemForm.propTypes = {
  locales: PropTypes.array.isRequired,
  item: PropTypes.object,
  itemType: PropTypes.object,
  fields: PropTypes.array,
  onSubmit: PropTypes.func.isRequired,
  isModal: PropTypes.bool,
  deepItems: PropTypes.array,
  form: PropTypes.string,
  disabled: PropTypes.bool,
}

export default ItemForm
