import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import Link from 'components/sub/Link'
import { fetchAll as fetchAccessTokens } from 'actions/accessTokens'
import SplitPane from 'react-split-pane'
import Spinner from 'components/sub/Spinner'
import FlipMove from 'react-flip-move'

class AccessTokens extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchAccessTokens())
  }

  renderAccessToken(accessToken) {
    return (
      <Link
        className="ItemRow"
        activeClassName="ItemRow--active"
        to={`/admin/access_tokens/${accessToken.id}/edit`}
        key={accessToken.id}
      >
        <div className="ItemRow__item">
          <div className="ItemRow__item__inner">
            <div className="ItemRow__item__content">
              <div className="ItemRow__item__title">
                {accessToken.attributes.name}
                {
                  accessToken.attributes.hardcoded_type &&
                    <span className="ItemRow__item__title__tag">
                      Non editable
                    </span>
                }
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  renderAccessTokens() {
    const { accessTokens } = this.props

    return (
      <div className="Items">
        {
          <div className="Items__items">
            <FlipMove
              staggerDelayBy={20}
              enterAnimation="accordionVertical"
              leaveAnimation="accordionVertical"
            >
              {accessTokens.map(this.renderAccessToken.bind(this))}
            </FlipMove>
          </div>
        }
        <Link
          className="Items__button"
          to="/admin/access_tokens/new"
        >
          <i className="icon--add" />
        </Link>
      </div>
    )
  }

  render() {
    return (
      <SplitPane minSize={300} defaultSize={400} split="vertical">
        <div>
          {
            this.props.accessTokens ?
              this.renderAccessTokens() :
              <Spinner size={100} />
          }
        </div>
        <div>
          {this.props.children}
        </div>
      </SplitPane>
    )
  }
}

AccessTokens.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accessTokens: PropTypes.array,
  children: PropTypes.element,
}

function mapStateToProps(state) {
  const accessTokens = Object.values(state.accessTokens)
    .sort((a, b) => a.attributes.name.localeCompare(b.attributes.name))

  return { accessTokens }
}

export default connect(mapStateToProps)(AccessTokens)
