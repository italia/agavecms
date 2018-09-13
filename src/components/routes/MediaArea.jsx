import React, { PropTypes } from 'react'
import Dropzone from 'react-dropzone'

import Component from 'components/BaseComponent'
import convertToFormErrors from 'utils/convertToFormErrors'
import ImageMetadataForm from 'components/sub/ImageMetadataForm'
import cloneDeep from 'deep-clone'
import InfiniteScroll from 'components/sub/InfiniteScroll'
import MediaGallery from 'components/form/MediaGallery'
import Spinner from 'components/sub/Spinner'
import Modal from 'components/sub/Modal'
import { getUploadsForQuery } from 'utils/storeQueries'
import { connect } from 'react-redux'
import omit from 'object.omit'
import { alert, notice } from 'actions/notifications'
import uploadFile from 'api/uploadFile'
import u from 'updeep'
import { compose, branch, withState, withProps, withHandlers } from 'recompose'
import { withRouter } from 'react-router'
import deepEqual from 'deep-equal'
import formatBytes from 'utils/formatBytes'
import getImageDimensions from 'utils/getImageDimensions'
import isImage from 'utils/isImage'

import {
  update as updateUpload,
  destroy as destroyUpload,
  create as createUpload,
} from 'actions/uploads'

import {
  fetchAll as fetchUploads,
  invalidate,
} from 'actions/uploadCollections'

const validateFile = (file) => {
  if (file.size > 10000000) {
    return 'imageInput.error.tooBig'
  }
  return undefined
}

class MediaArea extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isModalOpen: false,
      activeUpload: null,
      uploads: [],
      ignoreUpdates: false,
      searchTerm: props.query['filter[query]'],
      selection: []
    }
  }

  componentDidMount() {
    const { dispatch, query } = this.props
    dispatch(fetchUploads({ query }))
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextState.ignoreUpdates) {
      return false
    }

    return super.shouldComponentUpdate(nextProps, nextState, nextContext)
  }

  componentWillUpdate(nextProps) {
    const { dispatch, query } = this.props

    if (!deepEqual(query, nextProps.query)) {
      dispatch(fetchUploads({ query: nextProps.query }))
    }
  }

  handleDropFile(files) {
    const uploads = this.state.uploads

    files.reduce((chain, file) => {
      const validationError = validateFile(file)

      if (validationError) {
        const message = this.t(
          'fileInput.invalidFile',
          { error: this.t(validationError) }
        )
        this.props.dispatch(alert(message))
        return null
      }

      const id = Math.random().toString(36).substring(7)
      uploads.push({
        id,
        file,
        percent: 0,
        uploading: null
      })

      return chain.then(() => this.startUpload(id, file))
    }, Promise.resolve(true))

    this.setState({ uploads })
  }

  handleAddUploadToSelection(upload) {
    if (this.props.multiple) {
      if (this.state.selection.filter(up => up.path === upload.attributes.path).length === 0) {
        this.setState({ selection: this.state.selection.concat([upload.attributes]) })
      } else {
        this.setState({
          selection: this.state.selection.filter(up => up.path !== upload.attributes.path)
        })
      }
    } else {
      this.props.onSelect([upload.attributes])
    }
  }

  handleSubmit() {
    this.props.onSelect(this.state.selection)
  }

  handleBrowse(e) {
    e.preventDefault()
    e.stopPropagation()
    this.refs.dropzone.open()
  }

  handleLoadMore() {
    const { dispatch, query } = this.props
    dispatch(fetchUploads({ query }))
  }

  handleUploadEdit(upload, e) {
    e.preventDefault()
    this.setState({ isModalOpen: true, activeUpload: upload })
  }

  handleClose() {
    this.setState({ isModalOpen: false, activeUpload: null })
  }

  handleMetadataChange(newData) {
    const { dispatch } = this.props
    const { id, type } = this.state.activeUpload

    this.handleClose()

    return dispatch(updateUpload({
      id, data: { id, type, attributes: newData }
    }))
      .then(() => {
        dispatch(notice(this.t('editor.upload.update.success')))
      })
      .catch((error) => {
        dispatch(alert(this.t('editor.upload.update.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  startUpload(id, file) {
    let fetchingImageDimensions
    if (isImage(file.name)) {
      fetchingImageDimensions = getImageDimensions(file.preview)
    } else {
      fetchingImageDimensions = Promise.resolve({})
    }

    const uploading = uploadFile(file, (percent) => {
      const index = this.state.uploads.findIndex(upload => upload.id === id)
      this.setState({
        uploads: u({ [index]: { percent } }, this.state.uploads)
      })
    })

    const index = this.state.uploads.findIndex(upload => upload.id === id)
    this.setState({
      uploads: u({ [index]: { uploading: () => uploading } }, this.state.uploads)
    })

    Promise.all([fetchingImageDimensions, uploading.promise])
      .then((results) => {
        const dimensions = results[0]
        const response = results[1]
        const json = JSON.parse(response)

        const metadata = Object.assign({
          path: json.id,
          size: file.size,
          format: file.name.split('.').pop().toLowerCase()
        }, dimensions)

        return this.handleCreateUpload(metadata, id)
      })
      .catch(error => {
        if (error && error.data && error.data[0].id === 'FILE_STORAGE_QUOTA_EXCEEDED') {
          this.props.dispatch(alert(this.t('fileInput.quotaExceeded')))
        } else {
          this.props.dispatch(alert(this.t('fileInput.uploadError')))
        }

        this.setState({
          uploads: this.state.uploads.filter(upload => upload.id !== id)
        })
      })
  }

  handleUploadCancel(upload, e) {
    e.preventDefault()
    e.stopPropagation()

    upload.uploading.cancel()

    this.setState({
      uploads: this.state.uploads.filter(({ id }) => id !== upload.id)
    })
  }

  handleCreateUpload(upload, id) {
    const { dispatch, query } = this.props
    const payload = cloneDeep(upload)

    return dispatch(createUpload({ data: { type: 'upload', attributes: payload } }))
      .then(() => {
        dispatch(invalidate())

        this.setState({ ignoreUpdates: true })

        return dispatch(fetchUploads({ query }))
        .then(() => {
          this.setState({
            uploads: this.state.uploads.filter(up => up.id !== id),
            ignoreUpdates: false,
          })
        })
      })
      .catch((error) => {
        dispatch(alert(this.t('editor.upload.create.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  handleUploadDelete(upload) {
    const { dispatch, query } = this.props
    const { id, type } = upload

    return dispatch(destroyUpload({
      id, data: { id, type }
    }))
      .then(() => {
        dispatch(invalidate())
        return dispatch(fetchUploads({ query }))
      })
      .catch((error) => {
        dispatch(alert(this.t('editor.upload.destroy.failure')))
        return Promise.reject(convertToFormErrors(error))
      })
  }

  handleSearchTermChange(e) {
    this.setState({ searchTerm: e.target.value })
  }

  handleApplySearchTerm(e) {
    e.stopPropagation()
    e.preventDefault()

    const { query, setQuery } = this.props

    const term = this.state.searchTerm

    const newQuery = omit(query, ['filter[query]'])

    if (term) {
      newQuery['filter[query]'] = term
    }

    setQuery(newQuery)
  }

  handleTypeChange(filterType) {
    const { query, setQuery } = this.props

    if (filterType === 'all') {
      setQuery(omit(query, ['filter[type]']))
    } else {
      setQuery(Object.assign({}, query, { 'filter[type]': filterType }))
    }
  }

  renderBlankSlate() {
    return (
      <div className="Items__blank-slate__inner">
        <div className="Items__blank-slate__title">
          {this.t('editor.item.noItems.title')}
        </div>
      </div>
    )
  }

  renderFilter(filterType) {
    const { query } = this.props

    const className = ['MediaArea__topbar__filters__filter']

    const isSelected = filterType === 'all' ?
      !query['filter[type]'] :
      query['filter[type]'] === filterType

    if (isSelected) {
      className.push('is-selected')
    }

    return (
      <button
        className={className.join(' ')}
        key={filterType}
        onClick={this.handleTypeChange.bind(this, filterType)}
      >
        {this.t(`mediaArea.filterBy.${filterType}`)}
      </button>
    )
  }

  renderContent() {
    const filterTypes = ['all', 'image', 'file', 'video', 'other', 'not_used']
    const currentBytes = formatBytes(this.props.uploadedBytes)

    return (
      <div className="MediaArea">
        <Dropzone
          ref="dropzone"
          multiple
          disableClick
          className="MediaArea__main"
          activeClassName="is-dropping"
          rejectClassName="is-rejecting"
          onDrop={this.handleDropFile.bind(this)}
        >
          <InfiniteScroll
            inner
            key="gallery-scroll"
            onLoadMore={this.handleLoadMore.bind(this)}
            active={!this.props.isFetching && !this.props.isComplete}
            className="MediaArea__inner"
          >
            <div className="MediaArea__topbar">
              <div className="MediaArea__topbar__filters">
                {filterTypes.map(this.renderFilter.bind(this))}
              </div>
              <div className="MediaArea__topbar__search">
                <form onSubmit={this.handleApplySearchTerm.bind(this)}>
                  <input
                    type="text"
                    value={this.state.searchTerm || ''}
                    placeholder={this.t('newItem.filter')}
                    onChange={this.handleSearchTermChange.bind(this)}
                  />
                </form>
              </div>
              {
                !this.props.onSelect &&
                  <div className="MediaArea__topbar__add">
                    <div className="MediaArea__topbar__stats">
                      <div className="MediaArea__topbar__stats__inner">
                        <div className="MediaArea__topbar__stats__label">
                          {`${currentBytes} used (unlimited space available)`}
                        </div>
                      </div>
                    </div>
                    <div className="MediaArea__topbar__add__button">
                      <a
                        href="#"
                        onClick={this.handleBrowse.bind(this)}
                        className="button button--primary"
                      >
                        Upload new
                      </a>
                    </div>
                  </div>
              }
            </div>
            <div className="MediaArea__content">
              {
                this.props.uploads &&
                  <MediaGallery
                    multiple={this.props.multiple}
                    uploads={this.props.uploads ? this.props.uploads : []}
                    selection={this.state.selection}
                    tempUploads={this.state.uploads.slice().reverse()}
                    onUploadDelete={this.handleUploadDelete.bind(this)}
                    onUploadEdit={this.handleUploadEdit.bind(this)}
                    onUploadCancel={this.handleUploadCancel.bind(this)}
                    onSelect={
                      this.props.onSelect &&
                        this.handleAddUploadToSelection.bind(this)
                    }
                  />
              }
              {
                this.props.isFetching &&
                  <Spinner size={80} />
              }
            </div>
          </InfiniteScroll>
        </Dropzone>
        {
          this.props.onSelect && this.props.multiple &&
            <div className="MediaArea__actions">
              <button
                className="button button--primary"
                disabled={this.state.selection.length === 0}
                onClick={this.handleSubmit.bind(this)}
              >
                {
                  this.state.selection.length === 0 ?
                    'Select some images' :
                    `Add ${this.state.selection.length} images`
                }
              </button>
            </div>
        }
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderContent()}
        {
          this.state.isModalOpen &&
            <Modal
              huge
              title="Edit Image metadata"
              onClose={this.handleClose.bind(this)}
            >
              {
                this.state.activeUpload.attributes &&
                  <ImageMetadataForm
                    onSubmit={this.handleMetadataChange.bind(this)}
                    metadata={this.state.activeUpload.attributes}
                  />
              }
            </Modal>
        }
      </div>
    )
  }
}

MediaArea.propTypes = {
  multiple: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  setQuery: PropTypes.func.isRequired,
  query: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  setState: PropTypes.func,
  uploads: PropTypes.array,
  isFetching: PropTypes.bool,
  isComplete: PropTypes.bool,
  isPristine: PropTypes.bool,
  totalEntries: PropTypes.number,
  uploadedBytes: PropTypes.number
}

function mapStateToProps(state, props) {
  const { query } = props

  const {
    uploads,
    isComplete,
    isFetching,
    isPristine,
    totalEntries,
    uploadedBytes
  } = getUploadsForQuery(state, query)

  return {
    query,
    uploads,
    isComplete,
    isFetching,
    isPristine,
    totalEntries,
    uploadedBytes
  }
}

export default compose(
  branch(
    (props) => props.embedded,
    withState('query', 'setQuery', {}),
    compose(
      withRouter,
      withProps((props) => ({
        query: props.location.query
      })),
      withHandlers({
        setQuery: props => newQuery => {
          props.router.push({
            pathname: props.location.pathname,
            query: newQuery
          })
        }
      })
    )
  ),
  connect(mapStateToProps)
)(MediaArea)
