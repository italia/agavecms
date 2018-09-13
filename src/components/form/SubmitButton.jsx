import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

class SubmitButton extends Component {
  constructor(props) {
    super(props)
    this.renderSubmitButtonLabel = this.renderSubmitButtonLabel.bind(this)
  }

  renderSubmitButtonLabel() {
    if (this.props.submitting) {
      return (
        <span>
          <FormattedMessage id="button.submitting" />
          ...
        </span>
      )
    }

    if (this.props.fileUploadsInProgress) {
      return (
        <span>
          <FormattedMessage id="button.uploading" />
          ...
        </span>
      )
    }

    return <FormattedMessage id={`${this.props.intlLabel}.default`} />
  }

  render() {
    const { primary, submitting, dirty, fileUploadsInProgress } = this.props
    const className = ['button--huge button--expand']

    if (primary) {
      className.push('button--primary')
    }

    return (
      <button
        className={className.join(' ')}
        disabled={submitting || !dirty || fileUploadsInProgress}
      >
        { this.renderSubmitButtonLabel() }
      </button>
    )
  }
}

SubmitButton.propTypes = {
  submitting: PropTypes.bool.isRequired,
  intlLabel: PropTypes.string.isRequired,
  valid: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
  primary: PropTypes.bool.isRequired,
  fileUploadsInProgress: PropTypes.number.isRequired,
}

SubmitButton.defaultProps = {
  intlLabel: 'button',
  primary: true,
}

function mapStateToProps(state) {
  return { fileUploadsInProgress: state.ui.fileUploadsInProgress }
}

export default connect(mapStateToProps)(SubmitButton)
