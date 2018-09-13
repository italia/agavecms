import striptags from 'striptags'
import ellipsize from 'ellipsize'
import removeMarkdown from 'remove-markdown'

export default function buildTitleFromValue(value, field) {
  if (!field) {
    return value
  }

  if (field.attributes.field_type === 'text') {
    const { appeareance } = field.attributes

    if (appeareance.type === 'wysiwyg') {
      return ellipsize(striptags(value), 200)
    }
    if (appeareance.type === 'markdown') {
      return ellipsize(removeMarkdown(value), 200)
    }

    return ellipsize(value, 200)
  }

  if (field.attributes.field_type === 'video') {
    return value && value.title
  }

  return value
}
