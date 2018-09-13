import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { Field, FieldSelectInput } from 'components/form'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'

class SlugAppeareance extends Component {
  render() {
    const { namePrefix, itemTypeId } = this.props

    return (
      <div className="space--bottom-2">
        <Field
          required
          name={`${namePrefix}.title_field_id`}
          intlLabel="slug.titleField"
          intlHint="slug.titleFieldHint"
        >
          <FieldSelectInput itemTypeId={itemTypeId} />
        </Field>
        <Field
          name={`${namePrefix}.url_prefix`}
          intlLabel="slug.urlPrefix"
          intlHint="slug.urlPrefix.hint"
          intlPlaceholder="slug.urlPrefix.placeholder"
        >
          <input type="text" />
        </Field>
      </div>
    )
  }
}

SlugAppeareance.propTypes = {
  itemTypeId: PropTypes.string.isRequired,
  namePrefix: PropTypes.string.isRequired,
}

export default {
  Component: SlugAppeareance,
  validate: generateFormValidation({
    title_field_id: [validators.required()],
  }),
  fromJSON({ title_field_id, url_prefix }) {
    return { title_field_id, url_prefix }
  },
  toJSON(data) {
    const { title_field_id, url_prefix: urlPrefix } = data
    return { title_field_id, url_prefix: urlPrefix || null }
  },
}
