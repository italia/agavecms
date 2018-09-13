import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import {
  FormattedDate,
  FormattedRelative,
} from 'react-intl'

import isSameYear from 'date-fns/is_same_year'
import isSameWeek from 'date-fns/is_same_week'

class SmartDate extends Component {
  render() {
    const date = typeof this.props.value === 'string' ?
      Date.parse(this.props.value) :
      this.props.value

    if (isSameWeek(date, new Date())) {
      return <FormattedRelative value={date} />
    }

    if (isSameYear(date, new Date())) {
      return <FormattedDate value={date} month="long" day="numeric" />
    }

    return <FormattedDate value={date} month="long" day="numeric" year="numeric" />
  }
}

SmartDate.propTypes = {
  value: PropTypes.object,
}

export default SmartDate
