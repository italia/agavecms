import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { FormattedMessage } from 'react-intl'

class FormLocaleSwitcher extends Component {
  handleLocaleSwitch(locale, e) {
    e.preventDefault()
    this.props.onChange(locale)
  }

  renderLocale(locale) {
    const { currentLocale, errorsPerLocale } = this.props
    const errors = errorsPerLocale[locale]

    let className = 'FormLocaleSwitcher__item'
    if (currentLocale === locale) {
      className += ' FormLocaleSwitcher__item--active'
    }
    if (errors > 0) {
      className += ' FormLocaleSwitcher__item--errors'
    }

    return (
      <a
        href="#"
        onClick={this.handleLocaleSwitch.bind(this, locale)}
        className={className}
        key={locale}
      >
        <FormattedMessage id={`language.${locale}`} />
        {
          errors > 0 &&
            <span className="FormLocaleSwitcher__item__errors">
              {this.t('formLocaleSwitcher.errorsCount', { errors })}
            </span>
        }
      </a>
    )
  }

  render() {
    return (
      <div className="FormLocaleSwitcher">
        {this.props.locales.map(this.renderLocale.bind(this))}
      </div>
    )
  }
}

FormLocaleSwitcher.propTypes = {
  currentLocale: PropTypes.string.isRequired,
  errorsPerLocale: PropTypes.object.isRequired,
  locales: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default FormLocaleSwitcher
