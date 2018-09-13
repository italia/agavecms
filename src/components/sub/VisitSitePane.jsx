import React, { PropTypes } from 'react'
import enhanceWithClickOutside from 'react-click-outside'
import Component from 'components/BaseComponent'

class VisitSitePane extends Component {
  render() {
    const { productionUrl } = this.props

    if (!productionUrl) {
      return <span />
    }

    return (
      <a
        href={productionUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="NavigationBar__site-name__tag"
      >
        {this.t('navigationBar.publicSite')}
      </a>
    )
  }
}

VisitSitePane.propTypes = {
  productionUrl: PropTypes.string
}

export default enhanceWithClickOutside(VisitSitePane)
