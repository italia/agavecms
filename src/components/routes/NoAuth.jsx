import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import { fetch as getSite } from 'actions/site'
import Spinner from 'components/sub/Spinner'
import Title from 'react-document-title'
import imageUrl from 'utils/imageUrl'

class NoAuth extends Component {
  componentDidMount() {
    this.props.dispatch(getSite())
  }

  renderLoading() {
    return (
      <div className="FullpageLoader">
        <Spinner size={100} />
      </div>
    )
  }

  renderApp() {
    const { site } = this.props
    const backgroundColor = site.attributes.theme_color

    const siteName = site && site.attributes.theme.logo ?
      <img
        src={imageUrl(site.attributes.theme.logo)}
        alt={site && site.attributes.name}
      />
      :
      <span>
        {site && site.attributes.name}
      </span>

    return (
      <Title title={`${site.attributes.name} - Agave CMS`}>
        <div className="island" style={{ backgroundColor }}>
          <div className="island__wrap">
            <div className="island__site-name">
              {siteName}
            </div>
            {this.props.children}
            <a
              href="https://www.agave.com"
              className="island__footer"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="island__logo" />
            </a>
          </div>
        </div>
      </Title>
    )
  }

  render() {
    const { site } = this.props

    return site ?
      this.renderApp() :
      this.renderLoading()
  }
}

NoAuth.propTypes = {
  children: PropTypes.element,
  dispatch: PropTypes.func.isRequired,
  site: PropTypes.object,
}

function mapStateToProps({ site }) {
  return { site }
}

export default connect(mapStateToProps)(NoAuth)
