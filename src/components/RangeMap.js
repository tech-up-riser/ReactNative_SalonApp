import React, { Component, PropTypes } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native'
import MapView from 'react-native-maps'

import {
  VIEWPORT,
  NAVIGATOR_HEIGHT,
  STATUS_BAR_HEIGHT,
  STATUS_BAR_COLOR
} from '../constants'
import { getFontSize, dynamicSize } from '../utils/DynamicSize'

export default class RangeMap extends Component {

  _renderCircle () {
    const { range, coordinates } = this.props
    if (range) {
      return (
        <MapView.Circle
          key={Math.random()}
          center={coordinates}
          radius={range * 1000}
          fillColor={'rgba(114, 190, 213, 0.5)'}
          strokeColor={'rgba(255,255,255, 1)'}
          strokeWidth={1}
          ref={'circle'}
        />
      )
    }
  }

  render () {
    const { coordinates, width, height } = this.props
    return (
      <MapView
        style={[styles.map, (width) ? {width} : VIEWPORT.width, (height) ? {height} : null]}
        initialRegion={coordinates}
        maxDelta={1}
        showsUserLocation={false}
        rotateEnabled={false}
        pitchEnabled={false}
        zoomEnabled={false}
        scrollEnabled={false}
        showsPointsOfInterest={false}
      >
        <MapView.Marker
          coordinate={coordinates}
          image={require('../assets/images/map-marker.png')}
        />
        {this._renderCircle.bind(this)()}
      </MapView>
    )
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1
    // height: VIEWPORT.height / 4,
    // width: VIEWPORT.width
  //  marginBottom: dynamicSize(35)
  }
})

RangeMap.propTypes = {
  coordinates: PropTypes.object.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  range: PropTypes.number
}
