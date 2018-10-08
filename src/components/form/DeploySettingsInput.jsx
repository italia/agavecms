import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import deploySettings from 'components/form/deploy'
import Modal from 'components/sub/Modal'
import { ChoicesInput } from 'components/form'

class DeploySettingsInput extends Component {
  constructor(props) {
    super(props)
    this.state = { activeAdapter: null }
  }

  handleClose() {
    this.setState({ activeAdapter: null })
  }

  handleSubmit(settings) {
    this.props.onChange({ adapter: this.state.activeAdapter, settings })
    this.setState({ activeAdapter: null })
  }

  handleAdapterChange(adapter) {
    if (adapter) {
      this.setState({ activeAdapter: adapter })
    } else {
      this.props.onChange({ adapter, settings: null })
    }
  }

  render() {
    const { activeAdapter } = this.state
    const { webhookUrl } = this.props
    const value = this.props.value || this.props.defaultValue || {}

    const adapters = [
      {
        label: this.t('environment.deployAdapters.local_server'),
        iconUrl: '/assets/images/local_server.png',
        value: 'local_server',
        recommended: true,
      },
      {
        label: this.t('environment.deployAdapters.secure_ftp'),
        iconUrl: '/assets/images/sftp.png',
        value: 'secure_ftp',
      },
    ]

    const FormComponent = activeAdapter ? deploySettings[activeAdapter] : null

    return (
      <div>
        <ChoicesInput
          choices={adapters}
          value={value.adapter}
          onChange={this.handleAdapterChange.bind(this)}
        />
        {
          this.state.activeAdapter &&
            <Modal
              wide={!FormComponent.smallModal}
              title={
                this.t(
                  'deploySettingsInput.title',
                  {
                    activeAdapter:
                    this.t(`environment.deployAdapters.${this.state.activeAdapter}`)
                  }
                )
              }
              key={this.state.activeAdapter}
              onClose={this.handleClose.bind(this)}
            >
              <FormComponent
                settings={value.settings}
                webhookUrl={webhookUrl}
                onSubmit={this.handleSubmit.bind(this)}
              />
            </Modal>
        }
      </div>
    )
  }
}

DeploySettingsInput.propTypes = {
  value: PropTypes.object,
  defaultValue: PropTypes.object,
  onChange: PropTypes.func,
  webhookUrl: PropTypes.string,
}

DeploySettingsInput.defaultProps = {
  value: {},
}

export default DeploySettingsInput
