import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { reduxForm, getFormAsyncErrors } from 'redux-form'
import {
  Field,
  SubmitButton,
  Form,
  GlobalSeoInput,
  SwitchInput,
  ImageInput,
} from 'components/form'
import deepClone from 'deep-clone'
import validators from 'utils/validators'
import generateFormValidation from 'utils/generateFormValidation'
import FormLocaleSwitcher from 'components/sub/FormLocaleSwitcher'
import { connect } from 'react-redux'
import pick from 'object.pick'
import deepDot from 'deep-dot'

class SettingsForm extends Component {
  constructor(props) {
    super(props)
    this.state = { locale: props.locales[0] }
  }

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

  handleLocaleSwitch(locale) {
    this.setState({ locale })
  }

  render() {
    const {
      locales,
      error,
      submitting,
      handleSubmit,
      dirty,
      valid,
      errorsPerLocale,
    } = this.props

    return (
      <div>
        {
          locales.length > 1 &&
            <FormLocaleSwitcher
              currentLocale={this.state.locale}
              locales={locales}
              errorsPerLocale={errorsPerLocale}
              onChange={this.handleLocaleSwitch.bind(this)}
            />
        }
        <div className="Page__content">
          <Form error={error} onSubmit={handleSubmit}>
            <Field name="favicon" intlLabel="settings.favicon">
              <ImageInput editMetadata={false} />
            </Field>
            <Field
              name={
                locales.length > 1 ?
                  `global_seo.${this.state.locale}` :
                  'global_seo'
              }
              intlLabel="settings.globalSeo"
            >
              <GlobalSeoInput />
            </Field>
            <Field
              name="no_index"
              intlLabel="settings.noIndex"
            >
              <SwitchInput />
            </Field>
            <SubmitButton
              submitting={submitting}
              dirty={dirty}
              valid={valid}
              intlLabel="settings.button"
            />
          </Form>
        </div>
      </div>
    )
  }
}

SettingsForm.propTypes = {
  locales: PropTypes.array.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  site: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  errorsPerLocale: PropTypes.object.isRequired,
}

SettingsForm.contextTypes = Object.assign(
  { route: React.PropTypes.object },
  Component.contextTypes
)

const formConfig = {
  form: 'settings',
}

function mapStateToProps(state, props) {
  const site = props.site.attributes

  const initialValues = pick(site, ['no_index', 'favicon', 'global_seo'])

  const errors = getFormAsyncErrors('settings')(state)
  const errorsPerLocale = props.locales.reduce((acc, locale) => {
    const count = [
      'no_index',
      'favicon',
      props.locales.length > 1 ? `global_seo.${locale}` : 'global_seo',
    ]
    .map(field => errors && !!deepDot(errors, field))
    .filter(x => !!x)
    .length

    return Object.assign({ [locale]: count }, acc)
  }, {})

  return {
    initialValues,
    enableReinitialize: true,
    errorsPerLocale,
    validate: generateFormValidation({
      favicon: [validators.minImageWidth(256), validators.squareImage()],
    }),
    onSubmit(value) {
      const newSite = deepClone(props.site)
      newSite.attributes = value
      delete newSite.relationships
      return props.onSubmit(newSite)
    },
  }
}

export default connect(mapStateToProps)(reduxForm(formConfig)(SettingsForm))
