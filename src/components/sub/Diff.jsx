import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { diffWords } from 'diff'
import JSONPretty from 'react-json-pretty'
import { DiffPatcher } from 'jsondiffpatch/src/diffpatcher'
import html from 'jsondiffpatch/src/formatters/html'

export default class Diff extends Component {

  renderValue(value) {
    return (
      <div className="Diff__content">
        {
          typeof value === 'string' ?
            <pre>{value}</pre> :
            <JSONPretty json={value} />
        }
      </div>
    )
  }

  renderStringDiff() {
    const { previous, next } = this.props

    return (
      <div>
        {
          diffWords(previous, next).map((part, i) => {
            const className = []
            if (part.added) {
              className.push('Diff__part__added')
            }
            if (part.removed) {
              className.push('Diff__part__removed')
            }

            return (
              <span key={i} className={className.join(' ')}>
                {part.value}
              </span>
            )
          })
        }
      </div>
    )
  }

  renderObjectDiff() {
    const { previous, next } = this.props

    const patcher = new DiffPatcher()
    const delta = patcher.diff(previous, next)
    const result = html.format(delta, previous)
    html.hideUnchanged()

    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: result }} />
      </div>
    )
  }

  render() {
    const { previous, next } = this.props

    return (
      <div className="Diff">
        <div className="Diff__block">
          <div className="Diff__title">
            New value
          </div>
          {this.renderValue(next)}
        </div>
        <div className="Diff__block">
          <div className="Diff__title">
            Previous value
          </div>
          {this.renderValue(previous)}
        </div>
        {
          typeof next === 'string' &&
          typeof previous === 'string' &&
            <div className="Diff__block">
              <div className="Diff__title">
                What changed
              </div>
              <div className="Diff__content">
                <pre>
                  {this.renderStringDiff()}
                </pre>
              </div>
            </div>
        }
        {
          typeof next === 'object' &&
          typeof previous === 'object' &&
            <div className="Diff__block">
              <div className="Diff__title">
                What changed
              </div>
              <div className="Diff__content">
                {this.renderObjectDiff()}
              </div>
            </div>
        }
      </div>
    )
  }
}

Diff.propTypes = {
  next: PropTypes.string.isRequired,
  previous: PropTypes.string.isRequired,
}

