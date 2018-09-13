import Component from 'components/BaseComponent'
import React, { PropTypes } from 'react'
import TinyMCE from 'react-tinymce'

class HtmlInput extends Component {
  constructor(props) {
    super(props)
    this.id = Math.random().toString(36)
    this.state = {
      loaded: false,
    }
    this.handleEditorSetup = this.handleEditorSetup.bind(this)
  }

  componentDidMount() {
    this.isComponentMounted = true

    require.ensure(['tinymce'], (require) => {
      global.tinymce = require('tinymce/tinymce')
      require('tinymce/themes/modern/theme')
      require('tinymce/plugins/link')
      require('tinymce/plugins/code')
      require('tinymce/plugins/paste')
      require('tinymce/plugins/table')
      require('tinymce/plugins/autoresize')
      require('tinymce/plugins/lists')

      global.tinyMCE.baseURL = '/assets/tinymce'

      if (!this.isComponentMounted) {
        return
      }

      this.setState({ loaded: true })
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.editor) {
      return
    }

    if (
      nextProps.value !== this.props.value &&
        this.editor.getContent() !== nextProps.value
    ) {
      this.editor.setContent(nextProps.value || '')
    }
  }

  handleEditorSetup(editor) {
    this.editor = editor
  }

  handleChange(e) {
    if (e.target.getContent() !== this.props.value) {
      this.props.onChange(e.target.getContent())
    }
  }

  render() {
    if (!this.state.loaded) {
      return <div />
    }

    return (
      <TinyMCE
        content={this.props.value}
        config={{
          setup: this.handleEditorSetup,
          readonly: this.props.disabled,
          menubar: false,
          statusbar: false,
          autoresize_bottom_margin: 10,
          plugins: 'lists link code autoresize paste table',
          toolbar: [
            'formatselect bold italic strikethrough',
            'bullist numlist',
            'blockquote',
            'alignleft aligncenter alignright',
            'table link',
            'code',
          ].join(' | '),
          style_formats: [
            {
              title: 'Headers',
              items: [
                { title: 'Header 2', format: 'h1' },
                { title: 'Header 2', format: 'h2' },
                { title: 'Header 3', format: 'h3' },
                { title: 'Header 4', format: 'h4' },
                { title: 'Header 5', format: 'h5' },
                { title: 'Header 6', format: 'h6' },
              ],
            },
            {
              title: 'Blocks',
              items: [
                { title: 'Paragraph', format: 'p' },
                { title: 'Blockquote', format: 'blockquote' },
                { title: 'Div', format: 'div' },
                { title: 'Pre', format: 'pre' },
              ],
            },
          ],
        }}
        onChange={this.handleChange.bind(this)}
      />
    )
  }
}

HtmlInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
}

export default HtmlInput
