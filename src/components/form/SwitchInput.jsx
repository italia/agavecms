import React, { PropTypes } from 'react'
import RcSwitch from 'rc-switch'

export default function SwitchInput(props) {
  return (
    <div className="SwitchInput">
      <div className="SwitchInput__input">
        <RcSwitch {...props} checked={props.value} />
      </div>
      {
        props.label &&
          <div className="SwitchInput__label">
            {props.label}
          </div>
      }
    </div>
  )
}

SwitchInput.propTypes = {
  value: PropTypes.bool,
  label: PropTypes.string,
}
