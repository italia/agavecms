import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { reduxForm } from 'redux-form'
import {
  Field,
  SubmitButton,
  Form,
  SelectInput,
  ColorInput,
  ImageInput
} from 'components/form'
import deepClone from 'deep-clone'
import validators from 'utils/validators'
import generateFormValidation from 'utils/generateFormValidation'
import timezones from 'utils/timezones.json'
import languages from 'utils/languages'
import { connect } from 'react-redux'

class SiteForm extends Component {
  componentDidMount() {
    this.removeRouteLeaveHook = this.context.router.setRouteLeaveHook(
      this.context.route,
      this.routerWillLeave.bind(this)
    )
  }

  componentWillUnmount() {
    this.removeRouteLeaveHook()
  }

  routerWillLeave() {
    if (this.props.dirty) {
      return this.t('messages.notsaved')
    }

    return null
  }

  render() {
    const {
      error,
      submitting,
      handleSubmit,
      dirty,
      valid,
    } = this.props

    const localeOptions = Object.entries(languages).map(([value, label]) => {
      return { value, label }
    })

    const timezoneOptions = Object.keys(timezones).map((value) => {
      return {
        value: timezones[value],
        label: value,
      }
    })

    return (
      <div>
        <Form error={error} onSubmit={handleSubmit}>
          <Field
            name="name"
            intlLabel="site.name.label"
          >
            <input type="text" className="form__input--large" />
          </Field>
          <div className="space--bottom-5">
            <div className="grid space--bottom-2">
              <div className="grid__item width-3-12">
                <Field
                  name="primary_color"
                  label="Primary color"
                >
                  <ColorInput dispatchUi="primaryColor" />
                </Field>
              </div>
              <div className="grid__item width-3-12">
                <Field
                  name="accent_color"
                  label="Accent color"
                >
                  <ColorInput dispatchUi="accentColor" />
                </Field>
              </div>
              <div className="grid__item width-3-12">
                <Field
                  name="light_color"
                  label="Light color"
                >
                  <ColorInput dispatchUi="lightColor" />
                </Field>
              </div>
              <div className="grid__item width-3-12">
                <Field
                  name="dark_color"
                  label="Dark color"
                >
                  <ColorInput dispatchUi="darkColor" />
                </Field>
              </div>
            </div>
            <Field name="logo" intlLabel="site.logo">
              <ImageInput editMetadata={false} />
            </Field>
          </div>
          <Field
            name="locales"
            intlLabel="site.locales.label"
            intlHint="site.locales.hint"
          >
            <SelectInput multi options={localeOptions} />
          </Field>
          <Field name="timezone" intlLabel="site.timezone">
            <SelectInput options={timezoneOptions} />
          </Field>
          <SubmitButton
            submitting={submitting}
            dirty={dirty}
            valid={valid}
            intlLabel="site.button"
          />
        </Form>
      </div>
    )
  }
}

SiteForm.propTypes = {
  locales: PropTypes.array.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  site: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired
}

SiteForm.contextTypes = Object.assign(
  { route: React.PropTypes.object },
  Component.contextTypes
)

const formConfig = { form: 'site' }

function mapStateToProps(state, props) {
  const site = props.site.attributes

  const initialValues = {
    name: site.name,
    locales: site.locales,
    primary_color: site.theme.primary_color,
    accent_color: site.theme.accent_color,
    light_color: site.theme.light_color,
    dark_color: site.theme.dark_color,
    logo: site.theme.logo,
    timezone: site.timezone
  }

  return {
    initialValues,
    validate: generateFormValidation({
      name: [validators.required()],
      locales: [validators.minArrayLength(1)],
      primary_color: [validators.required()],
      accent_color: [validators.required()],
      light_color: [validators.required()],
      dark_color: [validators.required()]
    }),
    onSubmit(value) {
      const newSite = deepClone(props.site)

      newSite.attributes = {
        name: value.name,
        theme: {
          logo: value.logo,
          primary_color: value.primary_color,
          accent_color: value.accent_color,
          light_color: value.light_color,
          dark_color: value.dark_color
        },
        locales: value.locales,
        timezone: value.timezone
      }

      delete newSite.relationships
      return props.onSubmit(newSite)
    }
  }
}

export default connect(mapStateToProps)(reduxForm(formConfig)(SiteForm))
