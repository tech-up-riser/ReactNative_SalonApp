import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Slider,
  Alert,
  ListView,
  TouchableOpacity,
  Image
} from 'react-native'

import {
  NAVIGATOR_HEIGHT,
  STATUS_BAR_HEIGHT,
  STATUS_BAR_COLOR,
  VIEWPORT
} from '../constants'
import MapView from 'react-native-maps'
import Button from '../components/Common/Button'
import Colors from '../constants/Colors'
import screens from '../constants/Screens'
import { connect } from 'react-redux'
import numberExtension from '../components/Helpers/NumberExtension'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { setSearchBarText } from '../actions/searchBarTextAction'
import { setSearchingText } from '../actions/searchingTextAction'
import SearchBar from '../components/SearchBar'
import AccountButton from '../components/AccountButton'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { getFontSize, dynamicSize } from '../utils/DynamicSize'
import MultiSlider from '../components/MultiSlider/MultiSlider'
import CustomMarker from '../components/SalonsMap/CustomMarker'
import SalonMarker from '../components/SalonsMap/SalonMarker'
import WaitingList from '../components/SalonsMap/WaitingList'
import * as _ from 'lodash'

const milesInRange = 1000
numberExtension()

const initialRegion = {
  latitude: 34.09445, // 34.0481928
  longitude: -118.388328, // -118.4428069
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
}

const GOOGLE_API_KEY = 'AIzaSyCKLAAURP7FU44xRY__Hfl9ENRSbw1XLa0'
const SEARCH_BAR_HEIGHT = 40

const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => {
  return r1 !== r2
}})

class SalonsMap extends Component {

  constructor (props) {
    super(props)

    this.region = initialRegion
    this.range = 3
    this.radius = this.range * milesInRange
    this.isValid = false
    this.searchingRequests = []

    this.state = {
      region: this.region,
      range: this.range,
      radius: this.radius,
      isValid: this.isValid,
      searchResults: [],
      dataSource: dataSource.cloneWithRows([]),
      isLoading: true,
      markers: []
    }
  }

  componentDidMount () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('position:', position)
        // const initialPosition = JSON.stringify(position)
        if (_.has(position, ['coords', 'latitude'])) {
          const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: this.state.region.latitudeDelta,
            longitudeDelta: this.state.region.longitudeDelta
          }
          console.log('set current position', region)
          this.setState({region})
        }
      },
      (error) => {
        console.warn('getCurrentPosition error', error.message)
        // alert(error.message)
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )

    this.showWaitingList()

  }

  componentWillUnMount () {
    this._abortRequests()
  }

  panToPosition (lat, lng) {
    console.log('panToPosition', lat, lng)
    this.setState({
      markers: [],
      searchResults: [],
      dataSource: dataSource.cloneWithRows([])
    })
    const region = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: this.state.region.latitudeDelta,
      longitudeDelta: this.state.region.longitudeDelta
    }
    this._onRegionChangeComplete(region)
  }

  focusToAddress (address) {
    console.log('focusToAddress', address)
    this.props.dispatch(setSearchingText(''))

    const request = new XMLHttpRequest()
    request.timeout = 20000
    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return
      }
      if (request.status === 200) {
        const responseJSON = JSON.parse(request.responseText)
        console.log('geocode result', responseJSON)
        if (_.has(responseJSON, ['results', 0, 'geometry', 'location'])) {
          const location = responseJSON.results[0].geometry.location
          console.log(location)
          this.panToPosition(location.lat, location.lng)
        }
      } else {
        console.warn('google places geocoding: request could not be completed or has been aborted')
      }
    }
    request.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?&address=' + encodeURI(address) + '&key=' + GOOGLE_API_KEY)
    request.send()
    // this.props.dispatch(setSearchBarText(''))
  }

  componentWillReceiveProps (nextProps) {
    const { searchBarText, searchingText } = nextProps
    this.search(searchingText)
    if (searchBarText !== '' && searchBarText !== this.props.searchBarText) {
      this.focusToAddress(searchBarText)
    }
    this.detectSalonsInCircle(nextProps.salons)
  }

  // panToUserLocation () {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       // console.log('POSITION', position.coords.latitude);
  //       this.refs.my_map.animateToCoordinate({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude
  //       }, 200)
  //     },
  //     (error) => console.log('geolocation error', error.message),
  //     {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
  //   )
  // }

  getSalonCoordinate (salon) {
    return {
      latitude: parseFloat(salon.lat),
      longitude: parseFloat(salon.lng)
    }
  }

  showWaitingList () {
    this.props.navigator.showLightBox({
      screen: screens.WAITING_LIST, // unique ID registered with Navigation.registerScreen
      passProps: {
        onClose: () => this.props.navigator.dismissLightBox()
      },
      style: {
        backgroundBlur: 'none', // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
        // backgroundColor: '#AA888830' // tint color for the background, you can specify alpha here (optional),
        backgroundColor: 'rgba(255, 255, 255, 0.58)'
      }
    })
  }

  onCalloutPress (salon) {
    console.log('onCalloutPress')
    this.props.navigator.showLightBox({
      screen: screens.SALON_INFO, // unique ID registered with Navigation.registerScreen
      passProps: {
        salon: salon,
        onClose: () => this.props.navigator.dismissLightBox()
      },
      style: {
        backgroundBlur: 'none', // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
        // backgroundColor: '#AA888830' // tint color for the background, you can specify alpha here (optional),
        backgroundColor: 'rgba(74, 74, 74, 0.5)'
      }
    })
    // this.props.navigator.showModal({
    //   screen: screens.SALON_INFO, // unique ID registered with Navigation.registerScreen
    //   passProps: {
    //     salon: salon,
    //     onClose: () => this.props.navigator.dismissModal()
    //   },
    //   style: {
    //     backgroundBlur: 'dark', // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
    //     backgroundColor: '#99AA9901' // tint color for the background, you can specify alpha here (optional)
    //   }
    // })
  }

  _renderSalonMarkers () {
    console.log('render salon markers')
    let markers = []
    for (let salonId in this.props.salons) {
      const salon = this.props.salons[salonId]
      // markers.push(<MapView.Marker coordinate={this.getSalonCoordinate(salon)} image={require('../assets/images/map-marker.png')} key={salonId} />)
      const coordinate = this.getSalonCoordinate(salon)

      let R = 6371e3
      let φ1 = coordinate.latitude.toRadians()
      let φ2 = this.region.latitude.toRadians()
      let Δφ = (this.region.latitude - coordinate.latitude).toRadians()
      let Δλ = (this.region.longitude - coordinate.longitude).toRadians()
      let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      let d = R * c

      markers.push(
        <SalonMarker
          key={salonId}
          salon={salon}
          isAvailable={d < this.state.range * milesInRange}
          onCalloutPress={() => this.onCalloutPress(salon)}
        />
      )

      // if (d < this.range * milesInRange) {
      //   markers.push(<MapView.Marker coordinate={this.getSalonCoordinate(salon)} image={require('../assets/images/map-marker.png')} key={salonId} />)
      // } else {
      //   markers.push(<MapView.Marker coordinate={this.getSalonCoordinate(salon)} image={require('../assets/images/map-marker-gray.png')} key={salonId} />)
      // }

    }
    return markers
  }

  updateSalonMarkers (salons) {
    // console.log('update salon markers')
    let markers = []
    for (let salonId in salons) {
      const salon = salons[salonId]
      const coordinate = this.getSalonCoordinate(salon)

      let R = 6371e3
      let φ1 = coordinate.latitude.toRadians()
      let φ2 = this.region.latitude.toRadians()
      let Δφ = (this.region.latitude - coordinate.latitude).toRadians()
      let Δλ = (this.region.longitude - coordinate.longitude).toRadians()
      let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      let d = R * c

      markers.push(
        <SalonMarker
          key={salonId}
          salon={salon}
          isAvailable={d < this.state.range * milesInRange}
          onCalloutPress={() => this.onCalloutPress(salon)}
        />
      )
    }
    // console.log('markers count', markers.length)
    this.setState({markers})
  }

  _renderCircle () {
    const { region, radius } = this.state
    // console.log('render Circle', region, radius)
    if (region) {
      return (
        <MapView.Circle
          key={Math.random()}
          center={region}
          radius={radius}
          fillColor={'rgba(114, 190, 213, 0.5)'}
          strokeColor={'rgba(255,255,255, 1)'}
          strokeWidth={1}
          ref={'circle'}
        />
      )
    }
  }

  _renderSlider () {
    const { range } = this.state
    const thumbImages = [
      require('../assets/images/slider-thumb-1.png'),
      require('../assets/images/slider-thumb-2.png'),
      require('../assets/images/slider-thumb-3.png'),
      require('../assets/images/slider-thumb-4.png'),
      require('../assets/images/slider-thumb-5.png')
    ]
    return (
      <View style={styles.sliderBox}>
        <View style={styles.sliderContainer}>
          {/* <View style={styles.scale}> */}
          <Text style={styles.scaleMarkText1}>1 mi</Text>
          <Text style={styles.scaleMarkText2}>5 mi</Text>
          {/* </View> */}
          {/* <Slider
            key={'location-range-slider'}
            value={range}
            minimumValue={1}
            maximumValue={5}
            step={1}
            style={styles.flexible}
            minimumTrackTintColor={'#5B5D68'}
            thumbImage={thumbImages[range - 1]}
            onValueChange={this.onSlide.bind(this)}
          /> */}
          <MultiSlider
            sliderLength={SLIDER_CONTAINER_WIDTH * 0.6}
            min={1}
            max={5}
            step={1}
            values={[3]}
            onValuesChange={this.onSlideNew.bind(this)}
            onValueChangeFinish={this.onSlideNew.bind(this)}
            type={'age'}
            trackStyle={{height: 2}}
            unselectedStyle={{backgroundColor: '#5B5D68'}}
            selectedStyle={{backgroundColor: '#5B5D68'}}
            customMarker={CustomMarker}
          />
        </View>
      </View>
    )
  }

  _renderPlaces () {
    return (
      <GooglePlacesAutocomplete
        minLength={2}
        fetchDetails
        onPress={(data, details = null) => {
          console.log(details.geometry.location)
        }}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: GOOGLE_API_KEY,
          language: 'en', // language of the results
          types: 'geocode' // default: 'geocode'
        }}
        styles={{
          description: {
            // fontWeight: 'bold'
          },
          predefinedPlacesDescription: {
            // color: '#1faadb',
          },
          container: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 400
          },
          textInputContainer: {
            // opacity: 0
          }
        }}
        enablePoweredByContainer={false}
      />
    )
  }

  _renderSubmitButton () {
    const { isValid, region, range } = this.state
    let backgroundColor
    let handler
    if (isValid) {
      backgroundColor = Colors.GRAY
      handler = () => {
        let location = {
          latitude: region.latitude,
          longitude: region.longitude
        }
        this.props.navigator.push({
          screen: screens.LANDING_STEP_2,
          navigatorStyle: {
            navBarHidden: true
          },
          passProps: {
            location,
            range
          }
        })
      }
    } else {
      backgroundColor = Colors.DISABLED_BUTTON
      handler = () => { Alert.alert('No salons within your selected range') }
    }
    return (
      <Button
        type={'fullWidth'}
        label={'SET LOCATION'}
        backgroundColor={backgroundColor}
        handleOnPress={handler}
        fontSize={getFontSize(14)}
      />
    )
  }

  detectSalonsInCircle (salons) {
    let pointsInCircle = 0
    for (let salonId in salons) {
      const salon = salons[salonId]
      const coordinate = this.getSalonCoordinate(salon)

      let R = 6371e3
      let φ1 = coordinate.latitude.toRadians()
      let φ2 = this.region.latitude.toRadians()
      let Δφ = (this.region.latitude - coordinate.latitude).toRadians()
      let Δλ = (this.region.longitude - coordinate.longitude).toRadians()
      let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      let d = R * c

      if (d < this.range * milesInRange) {
        ++pointsInCircle
      }
    }
    this.isValid = pointsInCircle > 0
    // console.log('detectSalonsInCircle isValid', this.isValid, 'region', this.region.latitude, this.region.longitude)
    this.updateSalonMarkers(salons)
    this.updateState()

  }

  onSlide (range) {
    console.log('onSlide', range)
    this.range = range
    this.radius = range * milesInRange
    this.detectSalonsInCircle(this.props.salons)
  }

  onSlideNew (values) {
    console.log('onSlideNew', values)
    this.range = values[0]
    this.radius = values[0] * milesInRange
    this.detectSalonsInCircle(this.props.salons)
  }

  _onRegionChange (region) {
    // console.log('_onRegionChange', region, 'isLoading', this.state.isLoading)
    if (!this.state.isLoading) {
      this.region = region
      this.detectSalonsInCircle(this.props.salons)
    }
  }

  _onRegionChangeComplete (region) {
    //console.log('_onRegionChangeComplete', region)
    if (region) {
      if (this.state.isLoading) {
        this.detectSalonsInCircle(this.props.salons)
        this.setState({
          isLoading: false
      //    region: (this.region) ? this.region : initialRegion
        })
      } else {
        this.region = region
        this.detectSalonsInCircle(this.props.salons)
      }
    } else {
      //console.log('_onRegionChangeComplete, there is no region', region)
    }
  }

  updateState () {
    this.setState({
      region: this.region,
      range: this.range,
      radius: this.radius,
      isValid: this.isValid
    })
  }

  _abortSearchingRequests () {
    this.searchingRequests.forEach((request) => {
      request.abort()
    })
    this.searchingRequests = []
  }

  search (text) {
    if (text !== '') {
      this._abortSearchingRequests()
      const request = new XMLHttpRequest()
      this.searchingRequests.push(request)
      request.timeout = 20000
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return
        }
        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText)
          if (typeof responseJSON.predictions !== 'undefined') {
            if (this) {
              this.setState({
                searchResults: responseJSON.predictions,
                dataSource: dataSource.cloneWithRows(responseJSON.predictions)
              })
            }
          }
          if (typeof responseJSON.error_message !== 'undefined') {
            console.warn('google places autocomplete: ' + responseJSON.error_message)
          }
        } else {
          //console.warn('google places autocomplete: request could not be completed or has been aborted')
        }
      }
      request.open('GET', 'https://maps.googleapis.com/maps/api/place/autocomplete/json?&input=' + encodeURI(text) + '&key=' + GOOGLE_API_KEY)
      request.send()
    } else {
      console.log('search, text is empty, clear search result')
      this.setState({
        searchResults: [],
        dataSource: dataSource.cloneWithRows([])
      })
    }
  }

  getTextForSearchResult (searchResult) {
    return searchResult.description || searchResult.formatted_address || searchResult.name
  }

  onPressSearchResult (searchResult) {
    const text = this.getTextForSearchResult(searchResult)
    this.props.dispatch(setSearchBarText(text))
    this.setState({searchResults: []})
  }

  _renderSearchResult (searchResult) {
    const text = this.getTextForSearchResult(searchResult)
    return (
      <TouchableOpacity onPress={() => this.onPressSearchResult(searchResult)} style={styles.searchResult}>
        <Text style={styles.searchResultText}>{text}</Text>
      </TouchableOpacity>
    )
  }

  _renderSeparatorIfNeed (sectionId, rowId) {
    const { searchResults } = this.state
    if (rowId !== searchResults.length - 1) {
      return <View key={'' + sectionId + rowId} style={styles.separator} />
    }
  }

  _renderSearchResultsIfNeed () {
    const { dataSource, searchResults } = this.state
    if (searchResults.length) {
      return (
        <ListView
          dataSource={dataSource}
          renderRow={(searchResult) => this._renderSearchResult(searchResult)}
          style={styles.searchResults}
          renderSeparator={(sectionId, rowId) => this._renderSeparatorIfNeed(sectionId, rowId)}
          enableEmptySections
        />
      )
    }
  }

  openDrawer () {
    console.log('openDrawer')
    this.props.navigator.toggleDrawer({
      side: 'right', // the side of the drawer since you can have two, 'left' / 'right'
      animated: true, // does the toggle have transition animation or does it happen immediately (optional)
      to: 'open' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
    })
  }

  renderNavBar () {
    return (
      <View style={styles.navBar}>
        {/* <SearchBar /> */}
        <View style={styles.leftNav} />
        {/*<Text style={styles.navTitle}>Location</Text> */}
        <Image
          reSizeMode={'cover'}
          style={styles.logo}
          source={require('../assets/images/logo.png')}
        />
        <AccountButton onClick={this.openDrawer.bind(this)} />
      </View>
    )
  }

  panToUserLocation () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('panToUserLocation', position)
        if (_.has(position, ['coords', 'latitude'])) {
          this.panToPosition(position.coords.latitude, position.coords.longitude)
        }
      },
      (error) => {
        console.warn('getCurrentPosition error', error.message)
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )
  }

  _renderCurrentLocationButton () {
    return (
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={this.panToUserLocation.bind(this)}
      >
        <Icon
          name={'near-me'}
          size={24}
          color='#5B5D68'
        />
      </TouchableOpacity>
    )
  }

  renderServiceNotAvailable () {
    if (!this.state.isValid && !_.isEmpty(this.props.salons)) {
      return (
        <View style={styles.serviceNotAvailable}>
          <Text style={styles.serviceNotAvailableText}>Service not yet available here</Text>
        </View>
      )
    }
  }

  render () {
    return (
      <View style={styles.flexible}>
        <View style={styles.statusBar} />
        {this.renderNavBar()}


        <MapView
          style={styles.mapContainer}
          region={this.state.region}
          onPanDrag={() => console.log('ON MAP DRAG.............')}
          minDelta={0.01}
          maxDelta={1}
          showsUserLocation
          rotateEnabled={false}
          pitchEnabled={false}
          onRegionChange={this._onRegionChange.bind(this)}
          onRegionChangeComplete={this._onRegionChangeComplete.bind(this)}
          // customMapStyle={customStyle}
        >

          {this._renderCurrentLocationButton()}
          {this._renderCircle()}
          {/* {this._renderSalonMarkers()} */}
          {this.state.markers}
        </MapView>

        <View style={styles.searchBar}>
          <SearchBar />
        </View>

        {this._renderSlider()}
        {/* {this.renderServiceNotAvailable()} */}
        {this._renderSearchResultsIfNeed()}
        {this._renderSubmitButton()}
      </View>
    )
  }
}

const customStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: 'red',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: 'red',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: 'red',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#263c3f',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#6b9a76',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#38414e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#212a37',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9ca5b3',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: 'green',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: 'red',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#f3d19c',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2f3948',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#515c6d',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
]

const WINDOW_WIDTH = VIEWPORT.width
const SLIDER_CONTAINER_WIDTH = WINDOW_WIDTH * 417 / 750

const styles = StyleSheet.create({
  flexible: {
    flex: 1
  },
  mapContainer: {
    flex: 1
  },
  logo: {
    width: Math.min(VIEWPORT.width, 120),
    height: Math.min(VIEWPORT.height, 31)
    // height: (NAVIGATOR_HEIGHT * 0.9),
    // width: (WINDOW_WIDTH * 0.4)
  },
  leftNav: {
    flex: 1
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: STATUS_BAR_COLOR
  },
  navBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: {
      height: 1,
      width: 0
    },
    shadowRadius: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    height: NAVIGATOR_HEIGHT,
    zIndex: 1
  },
  navTitle: {
    fontSize: getFontSize(14),
    color: '#4A4A4A',
    fontWeight: '300',
    flex: 4,
    textAlign: 'center'
  },
  sliderBox: {
    position: 'absolute',
    top: VIEWPORT.height * 0.20,  // 0.15
    left: (WINDOW_WIDTH - SLIDER_CONTAINER_WIDTH) / 2,
    width: SLIDER_CONTAINER_WIDTH,
    height: VIEWPORT.height * 0.082,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#979797',
    borderWidth: 1
  },
  serviceNotAvailable: {
    position: 'absolute',
    top: VIEWPORT.height * 0.3,
    width: VIEWPORT.width,
    height: VIEWPORT.height * 0.082,
    backgroundColor: 'rgba(212,108,108,0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  serviceNotAvailableText: {
    fontSize: getFontSize(16),
    color: '#FFFFFF',
    fontWeight: '600',
    fontStyle: 'italic'
  },
  sliderContainer: {
    width: SLIDER_CONTAINER_WIDTH * 0.9,
    alignItems: 'center'
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: VIEWPORT.height * 0.04,
    right: VIEWPORT.width * 0.05,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#979797',
    borderWidth: 1,
    borderRadius: 24,
    padding: 9
  },
  scale: {
    //flexDirection: 'row',
    justifyContent: 'space-between',
    //zIndex: 2
    position: 'absolute'
  },
  scaleMarkText1: {
    color: '#5B5D68',
    fontWeight: '400',
    fontSize: getFontSize(11),
    textShadowColor: 'white',
    textShadowOffset: {width: 2, height: 0},
    textShadowRadius: 3,
    position: 'absolute',
    top: dynamicSize(5),
    left: dynamicSize(5)
  },
  scaleMarkText2: {
    color: '#5B5D68',
    fontWeight: '400',
    fontSize: getFontSize(11),
    textShadowColor: 'white',
    textShadowOffset: {width: 2, height: 0},
    textShadowRadius: 3,
    position: 'absolute',
    top: dynamicSize(5),
    right: dynamicSize(5)
  },
  searchResults: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + NAVIGATOR_HEIGHT + SEARCH_BAR_HEIGHT,
    left: VIEWPORT.width * 0.1,
    right: VIEWPORT.width * 0.1,
    backgroundColor: '#FFFFFF'
  },
  searchResult: {

  },
  searchResultText: {
    marginHorizontal: 4,
    marginVertical: 2
  },
  separator: {
    height: 1,
    backgroundColor: Colors.SEPARATOR
  },
  searchBar: {
    height: SEARCH_BAR_HEIGHT,
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + NAVIGATOR_HEIGHT
  }
})


SalonsMap.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigator: PropTypes.object.isRequired,
  searchingText: PropTypes.string.isRequired,
  searchBarText: PropTypes.string.isRequired,
  salons: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  searchingText: state.searchingText,
  searchBarText: state.searchBarText,
  salons: state.salons
})

export default connect(mapStateToProps)(SalonsMap)
