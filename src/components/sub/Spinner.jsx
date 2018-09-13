import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'

export default class Spinner extends Component {
  render() {
    const { inline, reverse } = this.props
    const className = ['Spinner']

    if (inline) {
      className.push('Spinner--inline')
    } else {
      className.push('Spinner--centered')
    }

    if (reverse) {
      className.push('Spinner--reverse')
    }

    const bars = []

    for (let i = 0; i < 12; i++) {
      const barStyle = {}
      barStyle.WebkitAnimationDelay = barStyle.animationDelay =
        `${(i - 12) / 10}s`

      barStyle.WebkitTransform = barStyle.transform =
        `rotate(${(i * 30)}deg) translate(146%)`

      bars.push(
        <div style={barStyle} className="Spinner__bar" key={i} />
      )
    }

    const { size } = this.props

    const style = {
      width: size * 0.5,
      height: size * 0.5,
    }

    if (inline) {
      style.marginLeft = size * 0.5
      style.marginTop = size * 0.5
    }

    return (
      <div
        {...this.props}
        className={className.join(' ')}
        style={style}
      >
        {bars}
      </div>
    )
  }
}

Spinner.propTypes = {
  size: PropTypes.number.isRequired,
  inline: PropTypes.bool,
  reverse: PropTypes.bool,
}

Spinner.defaultProps = {
  size: 32,
  inline: false,
}
