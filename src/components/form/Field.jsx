import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { Field as ReduxField } from 'redux-form'
import { FormattedHTMLMessage } from 'react-intl'
import SwitchInput from './SwitchInput'

class Field extends Component {
  getValidationMessages() {
    const { validators } = this.props

    if (!validators) {
      return []
    }

    return Object.entries(validators)
      .filter(([key]) => (
        key !== 'rich_text_blocks' &&
        key !== 'items_item_type' &&
        key !== 'item_item_type' &&
        key !== 'enum' &&
        key !== 'required'
      ))
      .map(([key, values]) => {
        const valorizedKeys = Object.entries(values)
          .filter((entry) => !!entry[1])
          .map((entry) => entry[0])
          .sort()
          .join('_')

        const formattedValues = Object.entries(values).reduce((acc, [option, value]) => {
          if (Array.isArray(value)) {
            return Object.assign(acc, { [option]: value.join(', ') })
          }

          return Object.assign(acc, { [option]: value })
        }, {})

        const keys = Object.assign({}, formattedValues, { valorizedKeys })

        return (
          <li key={key}>
            <FormattedHTMLMessage
              id={`fieldError.VALIDATION_${key.toUpperCase()}`}
              values={keys}
            />
          </li>
        )
      })
  }

  getLabelAndPlaceholder() {
    const { label, placeholder, intlLabel, intlPlaceholder } = this.props

    const finalLabel = intlLabel ?
      this.t(intlLabel) :
      label

    let finalPlaceholder = finalLabel

    if (placeholder || intlPlaceholder) {
      finalPlaceholder = intlPlaceholder ?
        this.t(intlPlaceholder) :
        placeholder
    }

    return {
      label: finalLabel,
      placeholder: finalPlaceholder,
    }
  }

  renderHint() {
    const { intlHint, hint, intlDocs, docsHref } = this.props
    const validationMessages = this.getValidationMessages()

    if (!hint && !intlHint && validationMessages.length === 0) {
      return undefined
    }

    let finalHint = null
    if (intlHint) {
      finalHint = this.t(intlHint)
    } else if (hint) {
      finalHint = hint
    }

    const docsLabel = intlDocs ? this.t(intlDocs) : null

    return (
      <div className="form__hint">
        {finalHint && <p>{finalHint}</p>}
        {
          validationMessages.length > 0 &&
            <ul>{validationMessages}</ul>
        }
        {
          docsLabel &&
            <a
              className="form__hint__docs"
              href={docsHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="icon--book" />
              <span>{docsLabel}</span>
            </a>
        }
      </div>
    )
  }

  render() {
    const {
      inline,
      showLabel,
      children,
      required,
      showErrorsIfUntouched,
      input,
      wrapInput,
      localized,
      meta: { touched, error },
      code,
    } = this.props

    const { label, placeholder } = this.getLabelAndPlaceholder()

    const hasErrors = (showErrorsIfUntouched || touched) && error

    const className = ['form__field']
    className.push(this.props.className)

    if (inline) {
      className.push('form__field--inline')
    }
    if (hasErrors) {
      className.push('form__field--invalid')
    }

    const value = typeof children.type === 'string' ?
      input.value :
      // if the input is a component, avoid coalescing empty values with
      // an empty string
      (input.value || null)

    const isSwitch = children.type === SwitchInput

    const labelComponent = (
      <label htmlFor={input.name} className="form__label">
        {localized && <i className="icon--earth" />}
        <span dangerouslySetInnerHTML={{ __html: label }} />
        {required && '*'}
        {
          code &&
            <span className="form__label__code">
              {code}
            </span>
        }
      </label>
    )

    const inputProps = Object.assign(wrapInput(input), { placeholder, id: input.name, value })

    if (isSwitch) {
      inputProps.label = labelComponent
    }

    return (
      <div className={className.join(' ')}>
        {
          !isSwitch && showLabel &&
            labelComponent
        }
        {React.cloneElement(children, inputProps)}
        {
          hasErrors ?
            <div className="form__error">
              <FormattedHTMLMessage
                id={`fieldError.${error.id}`}
                values={error.values}
              />
            </div> :
            this.renderHint()
        }
      </div>
    )
  }
}

Field.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  hint: PropTypes.string,
  intlHint: PropTypes.string,
  intlDocs: PropTypes.string,
  docsHref: PropTypes.string,
  placeholder: PropTypes.string,
  intlLabel: PropTypes.string,
  intlPlaceholder: PropTypes.string,
  children: PropTypes.element.isRequired,
  required: PropTypes.bool,
  validators: PropTypes.object,
  input: PropTypes.object,
  meta: PropTypes.object,
  role: PropTypes.object,
  wrapInput: PropTypes.func,
  showLabel: PropTypes.bool,
  showErrorsIfUntouched: PropTypes.bool.isRequired,
  inline: PropTypes.bool.isRequired,
  localized: PropTypes.bool.isRequired,
  code: PropTypes.string,
}

Field.defaultProps = {
  showErrorsIfUntouched: false,
  showLabel: true,
  inline: false,
  wrapInput: (input) => input,
  localized: false,
}

export default function OuterField(props) {
  return (
    <ReduxField {...props} component={Field}>
      {props.children}
    </ReduxField>
  )
}

OuterField.propTypes = {
  children: PropTypes.element.isRequired,
}
