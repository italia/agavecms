import React, { PropTypes } from 'react'
import Component from 'components/BaseComponent'
import GoogleMap from 'react-google-maps/lib/GoogleMap'
import Marker from 'react-google-maps/lib/Marker'
import SearchBox from 'react-google-maps/lib/SearchBox'
import ScriptjsLoader from 'react-google-maps/lib/async/ScriptjsLoader'
import deepEqual from 'deep-equal'
import config from 'config'

const GOOGLE_MAPS_API_KEY = config.googleMapsApiKey
const INPUT_STYLE = {
  border: '1px solid transparent',
  borderRadius: '1px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  boxSizing: 'border-box',
  MozBoxSizing: 'border-box',
  fontSize: '14px',
  height: '32px',
  marginTop: '10px',
  marginRight: '10px',
  outline: 'none',
  padding: '0 12px',
  textOverflow: 'ellipses',
  width: '400px',
}
const DEFAULT_EMPTY_ZOOM = 3
const DEFAULT_FILLED_ZOOM = 16
const DEFAULT_CENTER = { lat: 41.55196, lng: 12.57361 }

class LatLonInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bounds: null,
      center: (
        props.value ?
          { lat: props.value.latitude, lng: props.value.longitude } :
          DEFAULT_CENTER
      ),
      zoom: props.value ? DEFAULT_FILLED_ZOOM : DEFAULT_EMPTY_ZOOM,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!deepEqual(nextProps.value, this.props.value) && nextProps.value) {
      this.setState({
        zoom: DEFAULT_FILLED_ZOOM,
        center: { lat: nextProps.value.latitude, lng: nextProps.value.longitude },
      })
    }
  }

  handleBoundsChanged() {
    this.setState({
      bounds: this.refs.map.getBounds(),
      center: this.refs.map.getCenter(),
    })
  }

  handlePlacesChanged() {
    const { onBlur, disabled } = this.props

    const places = this.refs.searchBox.getPlaces()

    if (!disabled && places.length > 0) {
      const coords = places[0].geometry.location
      this.setState({ center: coords })
      onBlur({ latitude: coords.lat(), longitude: coords.lng() })
    }
  }

  handleZoomChanged() {
    const zoom = this.refs.map.getZoom()
    this.setState({ zoom })
  }

  handleDragend({ latLng }) {
    this.props.onBlur({ latitude: latLng.lat(), longitude: latLng.lng() })
  }

  renderGoogleMap() {

  }

  render() {
    const { value, disabled } = this.props

    const containerElement = (
      <div style={{ height: '300px' }} />
    )
    const loadingElement = (
      <div>Loading...</div>
    )

    return (
      config.googleMapsApiKey
       ? (
        <ScriptjsLoader
          hostname={'maps.googleapis.com'}
          pathname={'/maps/api/js'}
          query={{ key: GOOGLE_MAPS_API_KEY, libraries: 'places' }}
          loadingElement={loadingElement}
          containerElement={containerElement}
          googleMapElement={
            <GoogleMap
              ref="map"
              zoom={this.state.zoom}
              onZoomChanged={this.handleZoomChanged.bind(this)}
              center={this.state.center}
              onBoundsChanged={this.handleBoundsChanged.bind(this)}
              options={{ scrollwheel: false }}
            >
              {
                !disabled &&
                  <SearchBox
                    bounds={this.state.bounds}
                    controlPosition={3}
                    onPlacesChanged={this.handlePlacesChanged.bind(this)}
                    ref="searchBox"
                    placeholder={this.t('latLonInput.search')}
                    style={INPUT_STYLE}
                  />
              }
              {
                value &&
                  <Marker
                    position={{ lat: value.latitude, lng: value.longitude }}
                    defaultAnimation={2}
                    onDragend={this.handleDragend.bind(this)}
                    draggable={!disabled}
                  />
              }
            </GoogleMap>
          }
        />
       )
      : (
        <div className="form__error">
          { this.t('googleMaps.EmptyApiKey') }
        </div>
      )
    )
  }
}

LatLonInput.propTypes = {
  value: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }),
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
}

export default LatLonInput
