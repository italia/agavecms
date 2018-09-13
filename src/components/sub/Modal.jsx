import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import portal from 'utils/portal'

class Modal extends Component {
  handleClose(e) {
    e.preventDefault()
    this.props.onClose()
  }

  render() {
    const { title, freeContent, children, wide, big, huge, localeKey } = this.props
    let renderedTitle

    if (localeKey !== undefined) {
      renderedTitle = this.t(localeKey)
    } else {
      renderedTitle = title
    }

    const className = ['Modal__modal']
    if (wide) {
      className.push('Modal__modal--wide')
    }
    if (huge) {
      className.push('Modal__modal--huge')
    }
    if (big) {
      className.push('Modal__modal--big')
    }

    return (
      <div className="Modal">
        <div className="Modal__backdrop" />
        <div className={className.join(' ')}>
          <div className="Modal__modal__header">
            <div className="Modal__modal__title">
              {renderedTitle}
            </div>
            <div className="Modal__modal__close">
              <a
                href="#"
                className="button--rev"
                onClick={this.handleClose.bind(this)}
              >
                {this.t('modal.close')}
              </a>
            </div>
          </div>
          {
            freeContent && children
          }
          {
            !freeContent &&
              <div className="Modal__modal__content">
                {children}
              </div>
          }
        </div>
      </div>
    )
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.element,
  title: PropTypes.string,
  freeContent: PropTypes.bool,
  localeKey: PropTypes.string,
  wide: PropTypes.bool,
  big: PropTypes.bool,
  huge: PropTypes.bool,
}

Modal.defaultProps = {
  freeContent: false,
}

function domNodeFactory() {
  const node = document.createElement('div')
  document.body.appendChild(node)
  return node
}

export default portal(domNodeFactory)(Modal)
