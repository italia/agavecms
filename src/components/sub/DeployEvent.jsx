import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import {
  FormattedMessage,
  FormattedTime,
  FormattedDate,
} from 'react-intl'
import SmartDate from 'components/sub/SmartDate'
import Modal from 'components/sub/Modal'
import CopyToClipboard from 'components/sub/CopyToClipboard'
import titleize from 'utils/titleize'
import headerify from 'utils/headerify'

/* eslint-disable react/no-multi-comp */

function rows(text, max = 10) {
  return Math.min(
    text.trim().split('\n').length,
    max
  )
}

class Detail extends Component {
  render() {
    const { title, children } = this.props

    return (
      <div className="DeployEvent__detail">
        <div className="DeployEvent__detail__title">{this.t(title)}</div>
        {children}
      </div>
    )
  }
}

Detail.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
}

class DeployEvent extends Component {
  constructor(props) {
    super(props)
    this.state = { detailsOpen: false }
  }

  handleDetails(e) {
    e.preventDefault()
    this.setState({ detailsOpen: true })
  }

  handleClose() {
    this.setState({ detailsOpen: false })
  }

  renderCreatedAt() {
    const { event } = this.props

    return (
      <Detail title="deployEvent.details.timestamp">
        <FormattedDate value={Date.parse(event.attributes.created_at)} />
        &nbsp
        <FormattedTime value={Date.parse(event.attributes.created_at)} />
      </Detail>
    )
  }

  renderCommand() {
    const { event } = this.props
    const command = event.attributes.data.command

    if (!command) {
      return undefined
    }

    const formattedCommand = command.trim().split(' -').join(' \\\n  -')

    return (
      <Detail title="deployEvent.details.command">
        <CopyToClipboard
          value={formattedCommand}
          multiline
          rows={rows(formattedCommand)}
          className="form__input--code"
        />
      </Detail>
    )
  }

  renderBody(title, body) {
    if (!body) {
      return undefined
    }

    let formattedBody = body

    try {
      formattedBody = JSON.stringify(JSON.parse(body), null, 2)
    } catch (e) {
      // NOP
    }

    return (
      <Detail title={title}>
        <CopyToClipboard
          value={formattedBody}
          multiline
          rows={rows(formattedBody)}
          className="form__input--code"
        />
      </Detail>
    )
  }

  renderHeaders(title, headers) {
    if (!headers) {
      return undefined
    }

    const formattedHeaders = Object.entries(headers)
      .map(([header, value]) => `${headerify(header)}: ${value}`)
      .join('\n')

    return (
      <Detail title={title}>
        <CopyToClipboard
          value={formattedHeaders}
          multiline
          rows={rows(formattedHeaders)}
          className="form__input--code"
        />
      </Detail>
    )
  }

  renderStatusCode(title, code) {
    if (!code) {
      return undefined
    }

    return (
      <Detail title={title}>
        <p className="beta">{code}</p>
      </Detail>
    )
  }

  renderReason() {
    const { event } = this.props

    if (!event.attributes.data.reason) {
      return undefined
    }

    return (
      <Detail title="deployEvent.details.reason">
        <p className="gamma">
          {titleize(event.attributes.data.reason)}
        </p>
      </Detail>
    )
  }

  renderRequestDetails() {
    const { event } = this.props
    const data = event.attributes.data

    return (
      <div className="DeployEvent__details">
        {this.renderCommand()}
        {this.renderReason(data.reason)}
        {this.renderStatusCode('deployEvent.details.responseStatusCode', data.response_status)}
        {this.renderHeaders('deployEvent.details.responseHeaders', data.response_headers)}
        {this.renderBody('deployEvent.details.responseBody', data.response_body)}
        {this.renderCreatedAt()}
      </div>
    )
  }

  renderUnprocessableRequestDetails() {
    const { event } = this.props
    const data = event.attributes.data

    return (
      <div className="DeployEvent__details">
        {this.renderHeaders('deployEvent.details.requestHeaders', data.request_headers)}
        {this.renderBody('deployEvent.details.requestBody', data.request_body)}
        {this.renderCreatedAt()}
      </div>
    )
  }

  renderResponseDetails() {
    const { event } = this.props
    const data = event.attributes.data

    return (
      <div className="DeployEvent__details">
        {this.renderHeaders('deployEvent.details.requestHeaders', data.request_headers)}
        {this.renderBody('deployEvent.details.requestBody', data.request_body)}
        {this.renderCreatedAt()}
      </div>
    )
  }

  renderDetails() {
    const { event } = this.props

    switch (event.attributes.event_type) {
      case 'request':
        return this.renderRequestDetails()
      case 'request_failed':
        return this.renderRequestDetails()
      case 'request_unprocessable':
        return this.renderUnprocessableRequestDetails()
      case 'response_success':
        return this.renderResponseDetails()
      case 'response_failure':
        return this.renderResponseDetails()
      default:
        return undefined
    }
  }

  render() {
    const { event } = this.props

    return (
      <div className="DeployEvent">
        <div className="DeployEvent__inner">
          <div className="DeployEvent__title">
            <div className="DeployEvent__environment">
              {this.t(`deploymentEnvironments.${event.attributes.environment}`)}
            </div>
            <FormattedMessage id={`deployEvent.type.${event.attributes.event_type}`} />
          </div>
          <div className="DeployEvent__sub">
            <div className="DeployEvent__sub__item">
              <SmartDate value={event.attributes.created_at} />
            </div>
            {
              event.attributes.data &&
                <div className="DeployEvent__sub__item">
                  <a
                    href="#"
                    onClick={this.handleDetails.bind(this)}
                  >
                  {this.t('deployEvent.showDetails')}
                  </a>
                </div>
            }
          </div>
        </div>
        {
          this.state.detailsOpen &&
            <Modal
              title={this.t('deployEvent.detailsTitle')}
              onClose={this.handleClose.bind(this)}
            >
              {this.renderDetails()}
            </Modal>
        }
      </div>
    )
  }
}

DeployEvent.propTypes = {
  event: PropTypes.object.isRequired,
}

export default DeployEvent

/* eslint-enable react/no-multi-comp */
