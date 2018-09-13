import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import imageUrl from 'utils/imageUrl'
import Modal from 'components/sub/Modal'
import SeoForm from 'components/form/SeoForm'
import { connect } from 'react-redux'

class SeoInput extends Component {
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

  handleSubmit(value) {
    this.setState({ isModalOpen: false })
    this.props.onBlur(value)
  }

  handleReset(e) {
    e.preventDefault()
    this.props.onBlur(null)
  }

  renderGooglePreview() {
    const { value, disabled, globalSeo, locales, locale } = this.props
    let titleSuffix = null

    if (locales.length > 1) {
      titleSuffix = globalSeo && globalSeo[locale] && globalSeo[locale].title_suffix
    } else {
      titleSuffix = globalSeo && globalSeo.title_suffix
    }

    return (
      <div className="seo-preview__google">
        {
          value.image ?
            <div className="seo-preview__image is-filled">
              <img
                src={imageUrl(value.image, { w: 80, h: 80, mode: 'crop' })}
                alt="Google Preview"
              />
            </div>
            :
            <div className="seo-preview__image is-missing" />
        }
        <div className="seo-preview__title">
          {
            titleSuffix ?
              value.title + titleSuffix :
              value.title
          }
        </div>
        <div className="seo-preview__url">
          http://www.mywebsite.com/some/page/
        </div>
        <div className="seo-preview__description">
          {value.description}
        </div>
        {
          !disabled &&
            <div className="seo-preview__actions">
              <a
                href="#"
                className="button--tiny"
                onClick={this.handleOpen.bind(this)}
              >
                <i className="icon--edit" />
                <span>{this.t('seoInput.edit')}</span>
              </a>
              {' '}
              <a
                href="#"
                className="button--tiny button--alert"
                onClick={this.handleReset.bind(this)}
              >
                <i className="icon--delete" />
                <span>{this.t('seoInput.remove')}</span>
              </a>
            </div>
        }
      </div>
    )
  }

  renderBlankSlate() {
    const { disabled } = this.props

    return (
      <div className="seo-preview__blank-slate">
        {this.t('seoInput.blank')}

        {
          !disabled &&
            <div className="seo-preview__actions">
              <a
                href="#"
                className="button--small"
                onClick={this.handleOpen.bind(this)}
                data-test-hook="show-seo-input"
              >
                <i className="icon--edit" />
                <span>{this.t('seoInput.edit')}</span>
              </a>
            </div>
        }
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
              title={this.t('seoInput.modalTitle')}
              onClose={this.handleClose.bind(this)}
            >
              <SeoForm
                seo={value}
                onSubmit={this.handleSubmit.bind(this)}
              />
            </Modal>
        }
      </div>
    )
  }
}

SeoInput.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  globalSeo: PropTypes.object,
  locale: PropTypes.string,
  locales: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
}

function mapStateToProps(state, props) {
  return {
    globalSeo: state.site.attributes.global_seo,
    locales: state.site.attributes.locales,
    initialValues: props.value,
  }
}
export default connect(mapStateToProps)(SeoInput)
