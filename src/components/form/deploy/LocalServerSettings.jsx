import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Component from 'components/BaseComponent';

class LocalServerSettings extends Component {
  render() {
    return (
      <div className="LocalServerSettings">
        Ciao
      </div>
    )
  }
}

LocalServerSettings.smallModal = true

LocalServerSettings.proptypes = {
  settings: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
}

export default connect()(LocalServerSettings)
