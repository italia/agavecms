import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import imageUrl from 'utils/imageUrl'
import Modal from 'components/sub/Modal'
import { FormattedMessage } from 'react-intl'
import GlobalSeoForm from 'components/form/GlobalSeoForm'

class GlobalSeoInput extends Component {
  constructor(props) {
    super(props)
    this.state = { isModalOpen: false }
  }

  handleOpen(e) {
    e.preventDefault()
    this.setState({ isModalOpen: true })
  }

  handleClose() {
    this.setState({ isModalOpen: false })
  }

  handleReset(e) {
    e.preventDefault()
    this.props.onBlur(null)
  }

  handleSubmit(value) {
    this.setState({ isModalOpen: false })
    this.props.onBlur(value)
  }

  renderGooglePreview() {
    const { value } = this.props
    const { fallback_seo: seo } = value

    return (
      <div className="seo-preview__google">
        {
          seo.image ?
            <div className="seo-preview__image is-filled">
              <img
                src={imageUrl(seo.image, { w: 80, h: 80, mode: 'crop' })}
                alt="Preview"
              />
            </div>
            :
            <div className="seo-preview__image is-missing" />
        }
        <div className="seo-preview__title">
          {seo.title + (value.title_suffix || '')}
        </div>
        <div className="seo-preview__url">
          http://foo.bar/qux
        </div>
        <div className="seo-preview__description">
          {seo.description}
        </div>
        <div className="seo-preview__social">
          {
            value.twitter_account &&
              <div className="seo-preview__social__item">
                <i className="icon--twitter" />
                Twitter
              </div>
          }
          {
            value.facebook_page_url &&
              <div className="seo-preview__social__item">
                <i className="icon--facebook" />
                Facebook
              </div>
          }
        </div>
        <div className="seo-preview__actions">
          <a
            href="#"
            className="button--tiny"
            onClick={this.handleOpen.bind(this)}
          >
            <i className="icon--edit" />
            <span><FormattedMessage id="form.globalSeoInput.edit" /></span>
          </a>
          {' '}
          <a
            href="#"
            className="button--tiny button--alert"
            onClick={this.handleReset.bind(this)}
          >
            <i className="icon--delete" />
            <span><FormattedMessage id="form.globalSeoInput.reset" /></span>
          </a>
        </div>
      </div>
    )
  }

  renderBlankSlate() {
    return (
      <div className="seo-preview__blank-slate">
        <FormattedMessage id="form.globalSeoInput.notProvided" />

        <div className="seo-preview__actions">
          <a
            href="#"
            className="button--small"
            onClick={this.handleOpen.bind(this)}
            data-test-hook="show-global-seo-input"
          >
            <i className="icon--edit" />
            <span><FormattedMessage id="form.globalSeoInput.edit" /></span>
          </a>
        </div>
      </div>
    )
  }

  render() {
    const { value } = this.props

    return (
      <div>
        {
          value ?
            this.renderGooglePreview() :
            this.renderBlankSlate()
        }
        {
          this.state.isModalOpen &&
            <Modal
              title={this.t('globalSeoInput.modalTitle')}
              onClose={this.handleClose.bind(this)}
            >
              <GlobalSeoForm
                globalSeo={value}
                onSubmit={this.handleSubmit.bind(this)}
              />
            </Modal>
        }
      </div>
    )
  }
}

GlobalSeoInput.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
}

export default GlobalSeoInput
