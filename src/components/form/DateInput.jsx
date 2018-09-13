import Component from 'components/BaseComponent'
import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'

class DateInput extends Component {
  componentDidMount() {
    const { disabled } = this.props

    this.isComponentMounted = true

    require.ensure(
      ['jquery', 'pickadate-picker', 'pickadate-date', 'pickadate-time'],
      (require) => {
        const jQuery = require('jquery')

        global.jQuery = jQuery

        require('pickadate-picker')
        require('pickadate-date')
        require('pickadate-time')

        if (!this.isComponentMounted) {
          return
        }

        const self = this
        this.picker = jQuery(ReactDOM.findDOMNode(this)).pickadate({
          selectMonths: true,
          selectYears: true,
          onSet: () => {
            let newValue = self.picker.get('select', 'yyyy-mm-dd')
            if (!newValue) {
              newValue = null
            }
            if (self.props.value !== newValue) {
              self.props.onChange(newValue)
            }
          },
        }).pickadate('picker')

        this.picker.set(
          'select',
          this.props.value,
          { format: 'yyyy-mm-dd' }
        )

        if (disabled) {
          this.picker.set('disable', true)
        }
      }
    )
  }

  shouldComponentUpdate(props) {
    if (this.picker) {
      let currentValue = this.picker.get('select', 'yyyy-mm-dd')
      if (!currentValue) {
        currentValue = null
      }

      if (currentValue !== props.value) {
        this.picker.set('select', props.value, { format: 'yyyy-mm-dd' })
      }
    }
    return false
  }

  componentWillUnmount() {
    this.isComponentMounted = false
  }

  render() {
    return (
      <input
        type="text"
        className="picker__input"
        placeholder={this.t('dateTimeInput.insertDate')}
      />
    )
  }
}

DateInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
}

export default DateInput
