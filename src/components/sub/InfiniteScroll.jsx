import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import ReactDOM from 'react-dom'

class InfiniteScroll extends Component {
  constructor(props) {
    super(props)
    this.scrollListener = this.scrollListener.bind(this)
  }

  componentDidMount() {
    this.attachScrollListener()
  }

  componentDidUpdate() {
    const el = ReactDOM.findDOMNode(this)
    if (el.scrollHeight === el.offsetHeight && this.props.active) {
      this.props.onLoadMore()
    }
  }

  componentWillUnmount() {
    this.detachScrollListener()
  }

  scrollListener() {
    const el = ReactDOM.findDOMNode(this)
    const threshold = el.scrollHeight - el.scrollTop - el.offsetHeight
    if (threshold < this.props.threshold && this.props.active) {
      this.props.onLoadMore()
    }
  }

  attachScrollListener() {
    const el = ReactDOM.findDOMNode(this)
    el.addEventListener('scroll', this.scrollListener)
    el.addEventListener('resize', this.scrollListener)
    this.scrollListener()
  }

  detachScrollListener() {
    const el = ReactDOM.findDOMNode(this)
    el.removeEventListener('scroll', this.scrollListener)
    el.removeEventListener('resize', this.scrollListener)
  }

  render() {
    return (
      <div {...this.props}>
        {this.props.children}
      </div>
    )
  }
}

InfiniteScroll.propTypes = {
  onLoadMore: PropTypes.func.isRequired,
  active: PropTypes.bool,
  threshold: PropTypes.number.isRequired,
  children: PropTypes.node,
  inner: PropTypes.bool,
}

InfiniteScroll.defaultProps = {
  threshold: 250,
}

export default InfiniteScroll
