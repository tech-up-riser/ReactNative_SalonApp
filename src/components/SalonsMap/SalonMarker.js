import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import React, { Component, PropTypes } from 'react'
import MapView from 'react-native-maps'
import SalonCallout from './SalonCallout'
import { VIEWPORT } from '../../constants'

class SalonMarker extends Component {

  shouldComponentUpdate (nextProps) {
    return this.props.isAvailable !== nextProps.isAvailable
//    return false
  }

  onImageClick () {
    // console.log('on marker image click', this.refs.marker)
    // this.refs.marker.showCallout()
    this.props.onCalloutPress()
  }

  render () {
  //  console.log('marker render for salon', this.props.salon)
    const { salon, onCalloutPress, isAvailable } = this.props
    const imageSource = isAvailable ? require('../../assets/images/map-marker.png') : require('../../assets/images/map-marker-gray.png')
    return (

      <MapView.Marker
        ref={'marker'}
        identifier={salon.id}
        coordinate={{latitude: Number(salon.lat), longitude: Number(salon.lng)}}
        // title={salon.name}
        // description={salon.address}
        // image={imageSource}
        anchor={{x: 0.5, y: 1}}
        centerOffset={{x: 0.5, y: 1}}
        flat={false}
        // onCalloutPress={onCalloutPress}
        // calloutOffset={{ x: 0, y: 3 }}
        // calloutAnchor={{ x: 0.5, y: 0.4 }}
      >
        <TouchableOpacity
          onPress={this.onImageClick.bind(this)}
          activeOpacity={1}
        >
          <Image
            style={styles.pin}
            source={imageSource}
            onClick={this.onImageClick.bind(this)}
          >

            {/* <MapView.Callout tooltip style={styles.customView}>
              <SalonCallout
              width={VIEWPORT.width * 0.4}
              height={VIEWPORT.width * 0.4}
              >
              <View style={styles.salonImageContainer}>
              </View>
              <Text style={styles.salonName}>{salon.name}</Text>
              </SalonCallout>
            </MapView.Callout> */}
            {/* <Image
              style={styles.pin}
              source={imageSource}
              onClick={this.onImageClick.bind(this)}
            /> */}
          </Image>
        </TouchableOpacity>
      </MapView.Marker>
    )
  }
}

const styles = StyleSheet.create({
  customView: {
    width: VIEWPORT.width * 0.4,
    height: VIEWPORT.width * 0.4
  },
  salonImageContainer: {

  },
  salonName: {
    textAlign: 'center',
    alignSelf: 'center'
  }
})

SalonMarker.propTypes = {
  salon: PropTypes.object.isRequired,
  onCalloutPress: PropTypes.func.isRequired,
  isAvailable: PropTypes.bool.isRequired
}

export default (SalonMarker)
