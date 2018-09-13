import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { Field, SwitchInput } from 'components/form'

class ColorAppeareance extends Component {
  render() {
    const { namePrefix } = this.props

    return (
      <div className="space--bottom-2">
        <Field
          name={`${namePrefix}.enable_alpha`}
          intlLabel="color.enableAlpha"
        >
          <SwitchInput />
        </Field>
        <Field
          name={`${namePrefix}.preset_colors`}
          intlLabel="color.presetColors"
          intlHint="color.presetColors.hint"
          intlPlaceholder="color.presetColors.placeholder"
        >
          <input type="text" className="form__input--code" />
        </Field>
      </div>
    )
  }
}

ColorAppeareance.propTypes = {
  namePrefix: PropTypes.string.isRequired,
}

export default {
  Component: ColorAppeareance,
  fromJSON({ enable_alpha: enableAlpha, preset_colors: presetColors }) {
    return {
      enable_alpha: enableAlpha || false,
      preset_colors: (presetColors || []).join(', '),
    }
  },
  toJSON({ enable_alpha: enableAlpha, preset_colors: presetColors }) {
    return {
      enable_alpha: enableAlpha || false,
      preset_colors: (presetColors || '').split(/\s*,\s*/),
    }
  },
}
