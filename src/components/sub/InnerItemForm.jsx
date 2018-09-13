import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import {
  reduxForm,
  change,
  touch,
  getFormAsyncErrors,
  FieldArray,
} from 'redux-form'
import { Field, SubmitButton, Form } from 'components/form'
import { inputForFieldType } from 'utils/fieldTypes'
import FormLocaleSwitcher from 'components/sub/FormLocaleSwitcher'
import slugify from 'utils/slugify'
import { connect } from 'react-redux'
import deepDot from 'deep-dot'
import RichContent from 'components/sub/RichContent'
import { getCurrentRole } from 'utils/storeQueries'

class InnerItemForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      locale: props.locales[0],
    }
  }

  componentDidMount() {
    if (!this.props.isModal) {
      this.removeRouteLeaveHook = this.context.router.setRouteLeaveHook(
        this.context.route,
        this.routerWillLeave.bind(this)
      )
    }

    if (!this.props.isNewItem) {
      this.performAsyncValidation()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.form !== this.props.form && !this.props.isNewItem) {
      this.performAsyncValidation()
    }
  }

  componentWillUnmount() {
    if (this.removeRouteLeaveHook) {
      this.removeRouteLeaveHook()
    }
  }

  performAsyncValidation() {
    this.props.asyncValidate()
  }

  routerWillLeave() {
    if (this.props.dirty) {
      return this.t('messages.notsaved')
    }

    return null
  }

  handleLocaleSwitch(locale) {
    const { form, dispatch, fieldsByLocale } = this.props
    this.setState(
      { locale },
      () => dispatch(touch(form, ...fieldsByLocale[locale]))
    )
  }

  renderField(locale, name) {
    const {
      fieldAttributes,
      isNewItem,
      slugFields,
      form,
      locales,
      dispatch,
      disabled,
      role,
    } = this.props

    const attributes = fieldAttributes[name]

    if (attributes.field_type === 'rich_text') {
      return (
        <FieldArray
          key={name}
          attributes={attributes}
          locale={locale}
          locales={locales}
          itemTypeIds={attributes.validators.rich_text_blocks.item_types}
          name={name}
          form={form}
          disabled={disabled}
          component={RichContent}
        />
      )
    }

    const props = {
      name,
      showErrorsIfUntouched: !isNewItem,
      key: name,
      label: attributes.label,
      hint: attributes.hint,
      required: !!attributes.validators.required,
      validators: attributes.validators,
      localized: attributes.localized,
    }

    if (slugFields[name]) {
      const slugName = slugFields[name]

      props.wrapInput = (input) => {
        return Object.assign({}, input, {
          onChange(e) {
            const result = input.onChange(e)
            if (isNewItem) {
              dispatch(change(form, slugName, slugify(e.target.value)))
            }
            return result
          },
        })
      }
    }

    if (attributes.field_type === 'slug') {
      props.placeholder = 'my-awesome-page'
    }

    if (role.can_edit_schema) {
      props.code = attributes.api_key
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
    const {
      locales,
      fieldsByLocale,
      handleSubmit,
      submitting,
      error,
      dirty,
      valid,
      errorsPerLocale,
    } = this.props

    return (
      <div className="InnerItemForm">
        {
          this.props.localized &&
            <FormLocaleSwitcher
              currentLocale={this.state.locale}
              locales={locales}
              errorsPerLocale={errorsPerLocale}
              onChange={this.handleLocaleSwitch.bind(this)}
            />
        }
        <div className="Page__content">
          <Form error={error} onSubmit={handleSubmit}>
            {
              fieldsByLocale[this.state.locale]
                .map(this.renderField.bind(this, this.state.locale))
            }
            <SubmitButton
              submitting={submitting}
              valid={valid}
              dirty={dirty}
              intlLabel="item.button"
            />
          </Form>
        </div>
      </div>
    )
  }
}

InnerItemForm.propTypes = {
  locales: PropTypes.array.isRequired,
  fieldAttributes: PropTypes.object.isRequired,
  fieldsByLocale: PropTypes.object.isRequired,
  slugFields: PropTypes.object.isRequired,
  localized: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  isModal: PropTypes.bool,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  asyncValidate: PropTypes.func.isRequired,
  isNewItem: PropTypes.bool.isRequired,
  errorsPerLocale: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  role: PropTypes.object,
}

InnerItemForm.contextTypes = Object.assign(
  { route: React.PropTypes.object },
  Component.contextTypes
)

function mapStateToProps(state, props) {
  const errors = getFormAsyncErrors(props.form)(state)

  const errorsPerLocale = props.locales.reduce((acc, locale) => {
    const count = props.fieldsByLocale[locale]
      .map(field => errors && !!deepDot(errors, field))
      .filter(x => !!x)
      .length

    return Object.assign({ [locale]: count }, acc)
  }, {})

  const role = getCurrentRole(state)

  return { errorsPerLocale, role: (role ? role.attributes : {}) }
}

export default connect(mapStateToProps)(reduxForm()(InnerItemForm))
