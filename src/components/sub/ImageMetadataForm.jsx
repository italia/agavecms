import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import { reduxForm } from 'redux-form'
import { Field, SubmitButton, Form } from 'components/form'
import pick from 'object.pick'
import { connect } from 'react-redux'
import imageUrl from 'utils/imageUrl'
import CopyToClipboard from 'components/sub/CopyToClipboard'
import formatBytes from 'utils/formatBytes'
import { FormattedDate } from 'react-intl'

class ImageMetadataForm extends Component {
  render() {
    const {
      error,
      dirty,
      valid,
      submitting,
      handleSubmit,
      metadata,
    } = this.props

    const url = imageUrl(metadata, { h: 550, w: 670, fit: 'max', auto: 'compress' })

    return (
      <Form error={error} onSubmit={handleSubmit}>
        <div className="ImageMetadataForm">
          <div className="ImageMetadataForm__preview">
            <a
              href={imageUrl(metadata)}
              target="_blank"
              rel="noopener noreferrer"
              className="ImageMetadataForm__preview__image"
              style={{ backgroundImage: `url(${url})` }}
            />
          </div>
          <div className="ImageMetadataForm__form">
            <Field name="title" intlLabel="imageMetadata.title">
              <input type="text" />
            </Field>
            <Field name="alt" intlLabel="imageMetadata.alt">
              <input type="text" />
            </Field>
            <div className="form__field">
              <div className="form__label">URL</div>
              <CopyToClipboard
                className="form__input--milli"
                value={imageUrl(metadata)}
              />
            </div>
            <SubmitButton
              submitting={submitting}
              dirty={dirty}
              valid={valid}
              intlLabel="imageMetadata.button"
            />
            <div className="ImageMetadataForm__details">
              <div className="grid">
                <div className="grid__item desk-8-12 space--bottom-2">
                  <div className="ImageMetadataForm__details__item">
                    <div className="ImageMetadataForm__details__label">
                      File name
                    </div>
                    <div className="ImageMetadataForm__details__value">
                      {metadata.path.replace(/^.*[\\\/]/, '')}
                    </div>
                  </div>
                </div>
                <div className="grid__item desk-4-12 space--bottom-2">
                  <div className="ImageMetadataForm__details__item">
                    <div className="ImageMetadataForm__details__label">
                      File type
                    </div>
                    <div className="ImageMetadataForm__details__value">
                      {metadata.format.toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="grid__item desk-4-12">
                  <div className="ImageMetadataForm__details__item">
                    <div className="ImageMetadataForm__details__label">
                      File size
                    </div>
                    <div className="ImageMetadataForm__details__value">
                      {formatBytes(metadata.size)}
                    </div>
                  </div>
                </div>
                {
                  metadata.created_at &&
                    <div className="grid__item desk-4-12">
                      <div className="ImageMetadataForm__details__item">
                        <div className="ImageMetadataForm__details__label">
                          Upload date
                        </div>
                        <div className="ImageMetadataForm__details__value">
                          <FormattedDate value={Date.parse(metadata.created_at)} />
                        </div>
                      </div>
                    </div>
                }
                {
                  metadata.width &&
                    <div className="grid__item desk-4-12">
                      <div className="ImageMetadataForm__details__item">
                        <div className="ImageMetadataForm__details__label">
                          Dimensions
                        </div>
                        <div className="ImageMetadataForm__details__value">
                          {metadata.width}x{metadata.height}px
                        </div>
                      </div>
                    </div>
                }
              </div>
            </div>
          </div>
        </div>
      </Form>
    )
  }
}

ImageMetadataForm.propTypes = {
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  metadata: PropTypes.object.isRequired,
}

const formConfig = {
  form: 'imageMetadata',
  fields: ['title', 'alt'],
}

function mapStateToProps(state, props) {
  return {
    initialValues: pick(props.metadata, ['alt', 'title']),
    onSubmit(value) {
      return props.onSubmit(value)
    },
  }
}

export default connect(mapStateToProps)(reduxForm(formConfig)(ImageMetadataForm))
