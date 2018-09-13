import Component from 'components/BaseComponent'
import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import deepEqual from 'deep-equal'

class DateInput extends Component {
  constructor(props) {
    super(props)
    this.state = this.parseDateAndHour(props.value)
  }

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

        this.timepicker = jQuery(ReactDOM.findDOMNode(this.refs.timepicker)).pickatime({
          onSet: () => {
            if (disabled) {
              return
            }

            const hour = this.timepicker.get('select', 'HH:i:00')
            if (hour !== this.state.hour) {
              this.setState({ hour }, this.propagateValueChange.bind(this))
            }
          },
        }).pickatime('picker')

        this.datepicker = jQuery(ReactDOM.findDOMNode(this.refs.datepicker)).pickadate({
          selectMonths: true,
          selectYears: true,
          onSet: () => {
            if (disabled) {
              return
            }

            const date = this.datepicker.get('select', 'yyyy-mm-dd')
            if (date !== this.state.date) {
              this.setState({ date }, this.propagateValueChange.bind(this))
            }
          },
        }).pickadate('picker')

        this.update(this.state)

        if (disabled) {
          this.timepicker.set('disable', true)
          this.datepicker.set('disable', true)
        }
      }
    )
  }

  componentWillReceiveProps(nextProps) {
    const nextValue = nextProps.value || null
    const value = this.props.value || null
    if (!deepEqual(value, nextValue)) {
      this.setState(this.parseDateAndHour(nextValue))
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!deepEqual(nextState, this.state)) {
      this.update(nextState)
    }

    return false
  }

  componentWillUnmount() {
    this.isComponentMounted = false
  }

  update(state) {
    if (this.datepicker) {
      if (state.date) {
        this.datepicker.set('select', state.date, { format: 'yyyy-mm-dd' })
      } else {
        this.datepicker.set('clear')
      }
    }

    if (this.timepicker) {
      if (state.hour) {
        this.timepicker.set('select', state.hour, { format: 'HH:i:00' })
      } else {
        this.timepicker.set('clear')
      }
    }
  }

  parseDateAndHour(value) {
    if (value) {
      const [, date, hour, offset] = value
        .match(/^(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})(.+)$/)

      if (date && hour && offset) {
        return { hour, date, offset }
      }
    }

    return { hour: null, date: null, offset: 'Z' }
  }

  propagateValueChange() {
    const { date, hour, offset } = this.state

    if (date && hour) {
      const value = `${date}T${hour}${offset}`
      if (value !== this.props.value) {
        this.props.onChange(value)
      }
    } else if (this.props.value) {
      this.props.onChange(null)
    }
  }

  render() {
    return (
      <div className="grid">
        <div className="grid__item desk-4-12">
          <input
            className="picker__input"
            placeholder={this.t('dateTimeInput.insertDate')}
            type="text"
            ref="datepicker"
          />
        </div>
        <div className="grid__item desk-3-12">
          <input
            ref="timepicker"
            type="text"
            placeholder={this.t('dateTimeInput.insertHour')}
            className="picker__input"
          />
        </div>
      </div>
    )
  }
}

DateInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
}

export default DateInput
