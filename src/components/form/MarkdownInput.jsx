import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Component from 'components/BaseComponent'

class MarkdownInput extends Component {
  componentDidMount() {
    this.isComponentMounted = true

    if (this.props.disabled) {
      return
    }

    require.ensure(['simplemde'], (require) => {
      const SimpleMDE = require('simplemde')

      if (!this.isComponentMounted) {
        return
      }

      const { onChange, onBlur, value } = this.props
      const input = ReactDOM.findDOMNode(this.refs.input)

      this.mde = new SimpleMDE({
        element: input,
        status: false,
        spellChecker: false,
        initialValue: value,
        toolbar: [
          {
            name: 'heading',
            action: SimpleMDE.toggleHeadingSmaller,
            className: 're-icon re-formatting',
            title: 'Heading',
          },
          {
            name: 'bold',
            action: SimpleMDE.toggleBold,
            className: 're-icon re-bold',
            title: 'Bold',
          },
          {
            name: 'italic',
            action: SimpleMDE.toggleItalic,
            className: 're-icon re-italic',
            title: 'Italic',
          },
          {
            name: 'strikethrough',
            action: SimpleMDE.toggleStrikethrough,
            className: 're-icon re-deleted',
            title: 'Strikethrough',
          },
          {
            name: 'unordered-list',
            action: SimpleMDE.toggleUnorderedList,
            className: 're-icon re-unorderedlist',
            title: 'Generic List',
          },
          {
            name: 'ordered-list',
            action: SimpleMDE.toggleOrderedList,
            className: 're-icon re-orderedlist',
            title: 'Numbered List',
          },
          {
            name: 'quote',
            action: SimpleMDE.toggleBlockquote,
            className: 're-icon re-quote',
            title: 'Quote',
          },
          {
            name: 'link',
            action: SimpleMDE.drawLink,
            className: 're-icon re-link',
            title: 'Create Link',
          },
        ],
        autoDownloadFontAwesome: false,
      })

      const root = ReactDOM.findDOMNode(this.refs.root)

      root.querySelectorAll('.editor-toolbar a').forEach(el => {
        el.setAttribute('data-title', el.getAttribute('title'))
        el.removeAttribute('title')
      })

      this.mde.codemirror.on('change', () => {
        onChange(this.mde.value())
      })

      this.mde.codemirror.on('blur', () => {
        onBlur(this.mde.value())
      })
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value && this.mde.value() !== nextProps.value) {
      this.mde.value(nextProps.value || '')
    }
  }

  componentWillUnmount() {
    this.isComponentMounted = false
  }

  render() {
    const { disabled, value } = this.props

    if (disabled) {
      return (
        <textarea ref="input" value={value || ''} disabled />
      )
    }

    return (
      <div ref="root">
        <textarea ref="input" />
      </div>
    )
  }
}

MarkdownInput.propTypes = {
  value: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
}

export default MarkdownInput

