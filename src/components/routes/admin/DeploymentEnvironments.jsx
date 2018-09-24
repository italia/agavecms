import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { connect } from 'react-redux'
import Link from 'components/sub/Link'
import SplitPane from 'react-split-pane'
import FlipMove from 'react-flip-move'
import Modal from 'components/sub/Modal'
import EnvironmentForm from 'components/sub/EnvironmentForm'
import {
  create as createEnvironment,
  fetchAll as fetchEnvironments,
  fetch as fetchEnvironment,
} from 'actions/environments'
import generateEmptyEnvironment from 'utils/generateEmptyEnvironment'
import cloneDeep from 'deep-clone'
import { alert, notice } from 'actions/notifications'
import convertToFormErrors from 'utils/convertToFormErrors'

class DeploymentEnvironments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItemType: null
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchEnvironments())
  }

  handleNew(e) {
    e.preventDefault()
    const environment = generateEmptyEnvironment()
    this.setState({ activeItemType: environment })
  }

  handleNewClose() {
    this.setState({ activeItemType: null })
  }

  handleSubmit(environment) {
    const { dispatch } = this.props
    const payload = cloneDeep(environment)

    return dispatch(createEnvironment({ data: payload }))
      .then(response => {
        return dispatch(fetchEnvironment({ id: response.data.id }))
          .then(() => response)
      })
      .then(({ data }) => {
        dispatch(notice(this.t('admin.itemType.create.success')))
        this.setState({ activeItemType: null })
        this.pushRoute(`/admin/deployment/${data.id}`)
      })
      .catch((error) => {
        dispatch(alert(this.t('admin.itemType.create.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  renderEnv(environment) {
    const { id, attributes } = environment
    const { name } = attributes

    return (
      <Link
        to={`/admin/deployment/${id}`}
        className="ItemTypeRow"
        activeClassName="ItemTypeRow--active"
        key={id}
      >
        {name}
      </Link>
    )
  }

  renderBlankSlate() {
    return (
      <div className="Items__blank-slate">
        <div className="Items__blank-slate__inner">
          <div className="Items__blank-slate__title">
            {this.t('admin.environments.noItemTypes.title')}
          </div>
          <div className="Items__blank-slate__description">
            {this.t('admin.environments.noItemTypes.description')}
          </div>
        </div>
      </div>
    )
  }

  renderEnvironments() {
    const { environments } = this.props

    if (environments.length === 0) {
      return (
        <div className="Items">
          {this.renderBlankSlate()}
          <a
            href="#"
            onClick={this.handleNew.bind(this)}
            className="Items__button"
          >
            <i className="icon--add" />
          </a>
        </div>
      )
    }

    return (
      <div className="Items">
        <div className="Items__items">
          <FlipMove
            staggerDelayBy={20}
            enterAnimation="accordionVertical"
            leaveAnimation="accordionVertical"
          >
            { environments.map(this.renderEnv.bind(this)) }
          </FlipMove>
          <a
            href="#"
            onClick={this.handleNew.bind(this)}
            className="Items__button"
          >
            <i className="icon--add" />
          </a>
        </div>
      </div>
    )
  }

  render() {
    return (
      <SplitPane minSize={300} defaultSize={400} split="vertical">
        <div>
          {
            this.props.environments &&
            this.renderEnvironments()
          }
          {
            this.state.activeItemType &&
              <Modal
                localeKey="environment.add"
                onClose={this.handleNewClose.bind(this)}
              >
                <EnvironmentForm
                  environment={this.state.activeItemType}
                  onSubmit={this.handleSubmit.bind(this)}
                />
              </Modal>
          }
        </div>
        <div>
          {this.props.children}
        </div>
      </SplitPane>
    )
  }
}

DeploymentEnvironments.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.element,
  environments: PropTypes.array,
}


function mapStateToProps(state) {
  const environments = Object.values(state.environments)

  return { environments }
}

export default connect(mapStateToProps)(DeploymentEnvironments)
