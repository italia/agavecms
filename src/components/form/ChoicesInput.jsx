import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'

class ChoicesInput extends Component {
  handleChoiceClick(value, e) {
    e.stopPropagation()
    e.preventDefault()

    this.props.onChange(value)
  }

  renderChoice(choice) {
    const value = this.props.value || this.props.defaultValue || null

    let className = 'ChoicesInput__item'

    if (value === choice.value) {
      className += ' ChoicesInput__item--active'
    }

    if (choice.recommended) {
      className += ' ChoicesInput__item--recommendend'
    }

    return (
      <a
        href="#"
        className={className}
        key={choice.value}
        onClick={this.handleChoiceClick.bind(this, choice.value)}
      >
        <div className="ChoicesInput__item__inner">
          {
            choice.iconUrl &&
              <div className="ChoicesInput__item__image">
                <img
                  src={choice.iconUrl}
                  alt={choice.label}
                />
              </div>
          }
          <div className="ChoicesInput__item__label">
            {choice.label}
          </div>
          {
            choice.sub &&
              <div className="ChoicesInput__item__sub">
                {choice.sub}
              </div>
          }
        </div>
      </a>
    )
  }

  render() {
    const { choices } = this.props

    return (
      <div className="ChoicesInput">
        {choices.map(this.renderChoice.bind(this))}
      </div>
    )
  }
}

ChoicesInput.propTypes = {
  choices: PropTypes.array.isRequired,
  value: PropTypes.string,
  defaultValue: PropTypes.object,
  onChange: PropTypes.func,
}

export default ChoicesInput
