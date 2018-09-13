import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import {
  reduxForm,
  Field as ReduxField,
  formValueSelector,
  getFormSyncErrors,
  getFormSubmitErrors,
  change,
} from 'redux-form'
import { FormattedHTMLMessage } from 'react-intl'
import generateFormValidation from 'utils/generateFormValidation'
import validators from 'utils/validators'
import apifyLabel from 'utils/apifyLabel'
import {
  TextareaInput,
  SwitchInput,
  Field,
  SubmitButton,
  Form,
} from 'components/form'
import deepClone from 'deep-clone'
import pick from 'object.pick'
import {
  validatorsForFieldType,
  appeareanceForFieldType,
} from 'utils/fieldTypes'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'components/sub/Tabs'

class FieldForm extends Component {
  renderValidator([id, validator]) {
    const { fieldType, itemTypeId } = this.props
    const value = this.props.validatorsValue[id]

    return (
      <div key={id}>
        <div className="FieldForm__validator">
          <div className="FieldForm__validator__checkbox">
            {
              validator && validator.isRequired ?
                <input type="checkbox" checked disabled /> :
                <ReduxField
                  name={`validators.${id}.enabled`}
                  id={`validators.${id}.enabled`}
                  component="input"
                  type="checkbox"
                />
            }
          </div>
          <div className="FieldForm__validator__description">
            <label htmlFor={`validators.${id}.enabled`}>
              {
                this.existTranslation(`validator.${fieldType}.${id}.title`) ?
                  this.t(`validator.${fieldType}.${id}.title`) :
                  this.t(`validator.${id}.title`)
              }
            </label>
            <div className="form__hint">
              {
                <FormattedHTMLMessage
                  id={
                    this.existTranslation(`validator.${fieldType}.${id}.hint`) ?
                      `validator.${fieldType}.${id}.hint` :
                      `validator.${id}.hint`
                  }
                />
              }
            </div>
            {
              validator && (validator.isRequired || (value && value.enabled)) &&
                <div className="space--both-1">
                  <validator.Component
                    fieldType={fieldType}
                    namePrefix={`validators.${id}`}
                    itemTypeId={itemTypeId}
                    value={value}
                  />
                </div>
            }
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      fieldTypeValidators,
      fieldTypeAppeareance,
      appeareanceValue,
      error,
      valid,
      dirty,
      submitting,
      handleSubmit,
      itemTypeId,
      isNewField,
      dispatch,
      tabErrors,
      field,
    } = this.props

    return (
      <Form error={error} onSubmit={handleSubmit}>
        <Tabs>
          <Tab intlLabel="fieldForm.tab.basic" invalid={tabErrors.basic}>
            <Field
              required
              name="label"
              intlLabel="field.label"
              intlHint="field.labelHint"
              placeholder="Title"
              wrapInput={
                (input) => {
                  return Object.assign({}, input, {
                    onChange(e) {
                      const result = input.onChange(e)
                      if (isNewField) {
                        dispatch(change('field', 'api_key', apifyLabel(e.target.value)))
                      }
                      return result
                    },
                  })
                }
              }
            >
              <input type="text" className="form__input--large" autoFocus />
            </Field>
            <Field
              required
              name="api_key"
              intlLabel="field.apiKey"
              intlHint="field.apiKeyHint"
              placeholder="title"
            >
              <input type="text" className="form__input--code" />
            </Field>
            <Field name="localized" intlLabel="field.localized" intlHint="field.localizedHint">
              <SwitchInput />
            </Field>
            <SubmitButton
              submitting={submitting}
              dirty={dirty}
              valid={valid}
              intlLabel="field.button"
            />
          </Tab>
          {
            fieldTypeValidators &&
              <Tab intlLabel="fieldForm.tab.validations" invalid={tabErrors.validators}>
                <div className="form__field">
                  {Object.entries(fieldTypeValidators).map(this.renderValidator.bind(this))}
                </div>
                <SubmitButton
                  submitting={submitting}
                  dirty={dirty}
                  valid={valid}
                  intlLabel="field.button"
                />
              </Tab>
          }
          <Tab intlLabel="fieldForm.tab.presentation" invalid={tabErrors.appeareance}>
            {
              fieldTypeAppeareance &&
                <fieldTypeAppeareance.Component
                  namePrefix="appeareance"
                  value={appeareanceValue}
                  itemTypeId={itemTypeId}
                  fieldId={field.id}
                />
            }
            <Field
              name="hint"
              intlLabel="field.hint"
              intlHint="field.hintHint"
              intlPlaceholder="field.hintPlaceholder"
            >
              <TextareaInput />
            </Field>
            <SubmitButton
              submitting={submitting}
              dirty={dirty}
              valid={valid}
              intlLabel="field.button"
            />
          </Tab>
        </Tabs>
      </Form>
    )
  }
}

FieldForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isNewField: PropTypes.bool.isRequired,
  itemTypeId: PropTypes.string.isRequired,
  fieldType: PropTypes.string.isRequired,
  fieldTypeValidators: PropTypes.object,
  fieldTypeAppeareance: PropTypes.object,
  submitting: PropTypes.bool.isRequired,
  tabErrors: PropTypes.object.isRequired,
  error: PropTypes.string,
  field: PropTypes.object.isRequired,
  validatorsValue: PropTypes.object.isRequired,
  appeareanceValue: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
}

const formConfig = {
  form: 'field',
}

const selector = formValueSelector('field')

function mapStateToProps(state, props) {
  const fieldType = props.field.attributes.field_type
  const fieldAttributes = props.field.attributes

  const initialValues = pick(
    props.field.attributes,
    ['label', 'api_key', 'hint', 'localized']
  )

  const fieldsValidations = {
    label: [validators.required()],
    api_key: [validators.required()],
  }

  const fieldTypeValidators = validatorsForFieldType(fieldType)
  initialValues.validators = {}

  Object.entries(fieldTypeValidators).forEach(([id, validator]) => {
    if (!validator || !validator.isRequired) {
      initialValues.validators[id] = {
        enabled: !!fieldAttributes.validators[id],
      }
    } else {
      initialValues.validators[id] = {}
    }

    if (validator) {
      Object.assign(
        initialValues.validators[id],
        validator.fromJSON(
          fieldAttributes.validators[id] || {},
          state, props
        )
      )
    }
  })

  const fieldTypeAppeareance = appeareanceForFieldType(fieldType)
  if (fieldTypeAppeareance) {
    initialValues.appeareance = {}
    Object.assign(
      initialValues.appeareance,
      fieldTypeAppeareance.fromJSON(
        fieldAttributes.appeareance || {},
        state, props
      )
    )
  }

  const baseFieldsValidation = generateFormValidation(fieldsValidations)

  const validatorsValue = Object.entries(fieldTypeValidators)
    .reduce((acc, [id]) => {
      return Object.assign(acc, { [id]: selector(state, `validators.${id}`) })
    }, {})

  const appeareanceValue = selector(state, 'appeareance')

  const submitErrors = getFormSubmitErrors('field')(state)
  const syncErrors = getFormSyncErrors('field')(state)

  const tabErrors = {
    basic: (syncErrors && (syncErrors.api_key || syncErrors.label)) ||
      (submitErrors && (submitErrors.api_key || submitErrors.label)),
    validators: [
      (syncErrors && syncErrors.validators) || {},
      (submitErrors && submitErrors.validators) || {},
    ].some(errors => (
      Object.values(errors)
        .some(validatorErrors => (
          Object.values(validatorErrors).some(x => x)
        ))
    )),
    appeareance: [
      (syncErrors && syncErrors.appeareance) || {},
      (submitErrors && submitErrors.appeareance) || {},
    ].some(errors => (
      Object.values(errors)
        .some(appeareanceErrors => (
          Object.values(appeareanceErrors).some(x => x)
        ))
    )),
  }

  return {
    isNewField: !props.field.id,
    fieldType,
    fieldTypeValidators,
    fieldTypeAppeareance,
    tabErrors,
    validatorsValue,
    appeareanceValue,
    initialValues,
    validate(value) {
      const errors = baseFieldsValidation(value)
      errors.validators = {}

      Object.entries(fieldTypeValidators).forEach(([id, validator]) => {
        const validatorValue = value.validators[id]
        if (validator && (validator.isRequired || validatorValue.enabled)) {
          Object.assign(
            errors.validators,
            { [id]: validator.validate(validatorValue) }
          )
        }
      })

      if (fieldTypeAppeareance && fieldTypeAppeareance.validate) {
        errors.appeareance = fieldTypeAppeareance.validate(value.appeareance)
      }

      return errors
    },
    onSubmit(value) {
      const newField = deepClone(props.field)

      newField.attributes = Object.assign(newField.attributes, value)
      delete newField.relationships

      // FIXME
      if (typeof newField.attributes.localized === 'undefined') {
        newField.attributes.localized = false
      }

      if (newField.attributes.singleton) {
        newField.attributes.sortable = false
      }

      const fieldValidators = {}

      Object.entries(fieldTypeValidators).forEach(([id, validator]) => {
        const validatorValue = value.validators[id]
        if ((validator && validator.isRequired) || validatorValue.enabled) {
          if (validator) {
            fieldValidators[id] = validator.toJSON(validatorValue)
          } else {
            fieldValidators[id] = {}
          }
        }
      })

      newField.attributes.validators = fieldValidators

      if (fieldTypeAppeareance) {
        newField.attributes.appeareance = fieldTypeAppeareance.toJSON(value.appeareance)
      }

      return props.onSubmit(newField)
    },
  }
}
export default connect(mapStateToProps)(reduxForm(formConfig)(FieldForm))
