import React from 'react'
import Component from 'components/BaseComponent'
import Link from 'components/sub/Link'

class NoMatch extends Component {
  render() {
    return (
      <div className="NoMatch">
        <div className="NoMatch__inner">
          <h1 className="NoMatch__title">{this.t('noMatch.title')}</h1>
          <div className="NoMatch__body">
            <p>{this.t('noMatch.body')}</p>
          </div>
          <Link to="/" className="button button--primary">
            {this.t('noMatch.cta')}
          </Link>
        </div>
      </div>
    )
  }
}

export default NoMatch
