import React, { Component, PropTypes } from 'react'
import {
  View,
  StyleSheet,
  Picker,
  Text,
  TextInput,
  TouchableOpacity,
  findNodeHandle,
  Image,
  KeyboardAvoidingView
} from 'react-native'

import CustomMarker from '../components/LandingStep2/CustomMarker'
import HeaderCell from '../components/Common/HeaderCell'
import Colors from '../constants/Colors'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '../components/Common/Button'
import moment from 'moment'
import { connect } from 'react-redux'
import Geocoder from 'react-native-geocoder'
import AccountButton from '../components/AccountButton'
import BackButton from '../components/BackButton'
import screens from '../constants/Screens'
// import RangeSlider from '../components/MultiSlider/RangeSlider'
import RangeMap from '../components/RangeMap'

import {
  NAVIGATOR_HEIGHT,
  STATUS_BAR_HEIGHT,
  STATUS_BAR_COLOR,
  VIEWPORT,
  FREE_HEIGHT,
  SUBMIT_BUTTON_HEIGHT
} from '../constants'
import { getFontSize, dynamicSize } from '../utils/DynamicSize'

class LandingStep2 extends Component {

  constructor () {
    super()
    this.state = {
      selectedDate: 0,
      selectedStartTime: 0,
      selectedEndTime: 0,
      specialRequestsHeight: 0,
      address: '',
      times: [10, 14],
      timeMin: 17,
      timeMax: 37,
      timeDelta: 2,
      extensionSelected: false
    }

  }

  makePickerItemsTimes (timeMin, timeMax, delta) {
    let selectedDate = 1
    let selectedStartTime = timeMin
    if (this.isAvailableToday()) {
      selectedDate = 0
      selectedStartTime = this.timeNumNow()
    }
    this.setState({
      timesStart: this._makePickerItems(timeMin, timeMax - delta),
      timesEnd: this._makePickerItems(timeMin + delta, timeMax),
      dates: this.makePickerItemsDays(),
      selectedDate,
      selectedStartTime,
      selectedEndTime: selectedStartTime + delta
    })
  }

  componentWillMount () {
    const { location } = this.props
    const position = {
      lat: location.latitude,
      lng: location.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    }
    this.setState({
      lat: location.latitude,
      lng: location.longitude
    })

    this.makePickerItemsTimes(this.state.timeMin, this.state.timeMax, this.state.timeDelta)

    Geocoder.geocodePosition(position).then(res => {
      const result = res[0]
      if (result) {
        let address = result.feature || ''
        if (address.length) {
          address += ', '
        }
        const subAdminArea = result.subAdminArea
        if (subAdminArea) {
          address += subAdminArea + ', '
        }
        const adminArea = result.adminArea
        if (adminArea) {
          address += adminArea + ' '
        }
        address += result.postalCode || ''
        this.setState({
          address: address
        })
      }
    })
    .catch(err => console.log(err))
  }

  _scrollToInput (event) {
    // const node = findNodeHandle(event.target)
    // const extraHeight = 136
    // this.refs.scrollView.scrollToFocusedInput(node, extraHeight)
  }

  handleValuesChange (v) {
    console.log('handle values change', v)
    this.setState({
      times: v
    })
  }

  toggleExtensions () {
    this.setState({
      extensionSelected: !this.state.extensionSelected
    })
  }

  goBack () {
    this.props.navigator.pop({
      screen: screens.SALONS_MAP,
      navigatorStyle: {
        navBarHidden: true
      }
    })
  }

  timeNumsToMoment (days, timNum) {
    const res = moment()
    res.add(days, 'd')
    res.hour(parseInt(timNum / 2))
    res.minute(0)
    res.seconds(0)
    res.millisecond(0)
    if (timNum % 2 === 1) res.minute(30)
    return res
  }

  submit () {
    console.log('submit')
    const timeMin = this.timeNumsToMoment(this.state.selectedDate, this.state.selectedStartTime)
    const timeMax = this.timeNumsToMoment(this.state.selectedDate, this.state.selectedEndTime)
    // console.log('timeMin', timeMin)
    // console.log('timeMax', timeMax)
    const request = {
      times: [timeMin, timeMax],
      lat: this.state.lat,
      lng: this.state.lng,
      // selectedDate: this.dates[this.state.selectedDate],
      address: this.state.address,
      range: this.props.range
    }
    this.props.navigator.push({
      screen: screens.CHECKOUT,
      navigatorStyle: {
        navBarHidden: true
      },
      passProps: {
        request
      }
    })
  }

  openDrawer () {
    this.props.navigator.toggleDrawer({
      side: 'right', // the side of the drawer since you can have two, 'left' / 'right'
      animated: true, // does the toggle have transition animation or does it happen immediately (optional)
      to: 'open' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
    })
  }

  renderNavBar () {
    return (
      <View style={styles.navBar}>
        <BackButton onClick={() => this.props.navigator.pop()} />
        <Image
          reSizeMode={'cover'}
          style={styles.logo}
          source={require('../assets/images/logo.png')}
        />
        <AccountButton onClick={this.openDrawer.bind(this)} />
      </View>
    )
  }

  handleOnPressClearAll () {
    this.props.navigator.pop()
  }

  onChangeTimeRange (min, max) {
    this.setState({
      timeMin: min,
      timeMax: max
    })
  }

  dateToFormat (date) {
    return date.format('ddd, MMMM D').toUpperCase()
  }

  timeToFormat (time) {
    return time.format('h:mm A').toUpperCase()
  }

  timeNumNow () {
    let res = moment().hour() * 2
    if (moment().minutes() > 30) res += 1
    //console.log('timeNumNow', res)
    return res
  }

  isAvailableToday () {
    const timeNumNow = this.timeNumNow()
    console.log('timeNumNow', timeNumNow, 'isAvailableToday', timeNumNow <= this.state.timeMax - this.state.timeDelta)
    return (timeNumNow <= this.state.timeMax - this.state.timeDelta)
  }

  makePickerItemsDays () {
    let pickerItems = []
    for (let i = 0; i < 5; ++i) {
      let label = 'Today'
      if (i === 1) label = 'Tomorrow'
      if (i > 1) {
        label = this.dateToFormat(moment().add(i, 'd'))
      }
      const pickerItem = (
        <Picker.Item
          value={i}
          label={label}
          key={i}
          color={'red'}
          style={styles.datePickerItem}
        />
      )
      pickerItems.push(pickerItem)
    }
    return pickerItems
  }

  _makePickerItems (minValue, maxValue) {
    let pickerItems = []
    for (let i = minValue; i <= maxValue; i++) {
      let amPm = 'AM'
      if (i > 24) amPm = 'PM'
      let h = parseInt(i / 2)
      if (h > 12) h -= 12
      // const strHH = '0' + h
      // let hh = strHH.slice(-2)
      let mm = '00'
      if (i % 2) mm = '30'
      const label = `${h}:${mm} ${amPm}`
      const pickerItem = (
        <Picker.Item
          value={i}
          label={label}
          key={i}
        />
      )
      pickerItems.push(pickerItem)
    }
    return pickerItems
  }


  onSelectStartTime (v, selectedDate) {
    // console.log('onSelectStartTime', v, 'selectedDate', selectedDate)
    let selectedStartTime = v
    const timeNumNow = this.timeNumNow()
    if (selectedDate === 0 && selectedStartTime < timeNumNow) {
      selectedStartTime = timeNumNow
    }
    this.setState({selectedStartTime})
    if (this.state.selectedEndTime < selectedStartTime + this.state.timeDelta) {
      this.setState({selectedEndTime: selectedStartTime + this.state.timeDelta})
    }
  }

  onSelectEndTime (v) {
    let selectedEndTime = v
    const timeNumNow = this.timeNumNow()
    if (this.state.selectedDate === 0 && selectedEndTime - this.state.timeDelta < timeNumNow) {
      selectedEndTime = timeNumNow + this.state.timeDelta
    }
    this.setState({selectedEndTime})
    if (this.state.selectedStartTime + this.state.timeDelta > selectedEndTime) {
      this.setState({selectedStartTime: selectedEndTime - this.state.timeDelta})
    }
  }

  onSelectDate (v) {
    const isAvailableToday = this.isAvailableToday()
    if (v === 0 && !isAvailableToday) {
      console.log('there is no available time for today, set tomorrow')
      this.setState({
        selectedDate: 1
      })
    } else if (v === 0) {
      console.log('set the day is today')
      this.setState({
        selectedDate: v
      })
      console.log('check is selected time still valid')
      this.onSelectStartTime(this.state.selectedStartTime, 0)
    } else {
      this.setState({
        selectedDate: v
      })
    }
  }

  render () {
    const { location } = this.props
    let { specialRequestsHeight, address } = this.state
    specialRequestsHeight = Math.max(dynamicSize(29), this.state.specialRequestsHeight)
    const rangeMapCoordinates = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    }
    const checkboxStyle = (this.state.extensionSelected) ? [styles.circleUnchecked, styles.circleChecked] : styles.circleUnchecked

    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        {this.renderNavBar()}
        <KeyboardAvoidingView
          behavior={'position'}
          contentContainerStyle={styles.pageContent}
        >
          <View style={styles.locationContainer}>
            <HeaderCell text={'LOCATION'} fontSize={getFontSize(12)} style={{marginBottom: 0}} />
            <View style={{flex: 1, alignItems: 'center'}}>
              <TouchableOpacity
                onPress={this.goBack.bind(this)}
                style={{marginVertical: VIEWPORT.height * 0.02}}
              >
                <RangeMap
                  coordinates={rangeMapCoordinates}
                  width={VIEWPORT.width}
                  range={this.props.range}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.abilityContainer}>
            <HeaderCell text={'AVAILABILITY'} fontSize={getFontSize(12)} />
            <View style={styles.datePickerContainer}>
              <Picker
                itemStyle={styles.datePickerItem}
                style={styles.datePickerDate}
                selectedValue={this.state.selectedDate}
                onValueChange={this.onSelectDate.bind(this)}
              >
                {this.state.dates}
              </Picker>
              <Picker
                itemStyle={styles.datePickerItem}
                style={styles.datePickerTime}
                selectedValue={this.state.selectedStartTime}
                onValueChange={(startTime) => this.onSelectStartTime(startTime, this.state.selectedDate)}
              >
                {this.state.timesStart}
              </Picker>
              <Picker
                itemStyle={styles.datePickerItem}
                style={styles.datePickerTime}
                selectedValue={this.state.selectedEndTime}
                onValueChange={this.onSelectEndTime.bind(this)}
              >
                {this.state.timesEnd}
              </Picker>
            </View>
          </View>

          <View style={styles.specialRequestsBox}>
            <HeaderCell text={'SPECIAL REQUESTS'} fontSize={getFontSize(12)} />
            <TouchableOpacity
              onPress={this.toggleExtensions.bind(this)}
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingLeft: dynamicSize(25),
                paddingVertical: dynamicSize(25)
              }}>
              <View
                onPress={() => clickHandler(packId)}
                style={checkboxStyle}>
                <Image source={require('../assets/images/check-icon.png')} />
              </View>
              <View style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
              }}>
                <Text style={{fontSize: dynamicSize(16), marginRight: dynamicSize(5), fontWeight: '400', color: '#666666'}}>{('HAIR EXTENSIONS?').toUpperCase()}</Text>
                <Text style={{fontSize: dynamicSize(12), color: '#9B9B9B'}}>$5 will be added to your blowout</Text>

              </View>
            </TouchableOpacity>

            <View style={styles.subBox}>
              <TextInput
                style={styles.specialRequestsInput}
                placeholder={'Anything else we should know?'}
                ref={r => {
                  this.specialRequestsInput = r
                  return
                }}
                // onFocus={console.log('put this all in a modal')}
                placeholderTextColor={Colors.PLACEHOLDER}
                multiline
                blurOnSubmit
                onChange={(event) => {
                  // this.setState({ specialRequestsHeight: event.nativeEvent.contentSize.height })
                  // this._scrollToInput.bind(this)(event)
                }}
              />
            </View>
          </View>

          <View style={{height: SUBMIT_BUTTON_HEIGHT}}>
            <Button
              type={'fullWidth'}
              label={'CHECKOUT'}
              backgroundColor={Colors.GRAY}
              handleOnPress={this.submit.bind(this)}
              fontSize={getFontSize(14)}
              keyboardAvoiding={false}
            />
          </View>
        </KeyboardAvoidingView>

      </View>
    )
  }
}

const leftOffset = 35
const rightOffset = 30

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  pageContent: {
    marginTop: NAVIGATOR_HEIGHT + STATUS_BAR_HEIGHT,
    height: FREE_HEIGHT + SUBMIT_BUTTON_HEIGHT,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  locationContainer: {
    flex: 1.3,
    justifyContent: 'flex-start'
  },
  abilityContainer: {
    flex: 1.2
  },
  statusBar: {
    position: 'absolute',
    top: 0,
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
    position: 'absolute',
    width: VIEWPORT.width,
    top: STATUS_BAR_HEIGHT,
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
  locationBox: {
    height: VIEWPORT.height * 0.2,
    justifyContent: 'center'
  },
  subBox: {
    flex: 1,
    marginLeft: leftOffset,
    marginRight: rightOffset,
    borderBottomColor: 'rgba(146,146,146,0.1)',
    borderBottomWidth: 1,
    justifyContent: 'center'
  },
  locationSubBox: {
    marginLeft: 0
  },
  locationText: {
    fontSize: getFontSize(14),
    color: '#5B5D68'
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  datePickerDate: {
    flex: 1.6
  },
  datePickerTime: {
    flex: 1
  },
  datePickerItem: {
    height: VIEWPORT.height * 0.22,
    fontSize: getFontSize(16),
    color: '#555555'
  },
  timeRangeBox: {
    height: VIEWPORT.height * 0.13,
    alignItems: 'center'
  },
  specialRequestsBox: {
    justifyContent: 'center',
    flex: 1.5
  },
  specialRequestsInput: {
    fontSize: getFontSize(14),
    flex: 1
  },
  clearBox: {
    marginTop: dynamicSize(39),
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  clearButton: {
    width: VIEWPORT.width * 0.28,
    justifyContent: 'center',
    alignItems: 'center'
  },
  clearText: {
    fontSize: getFontSize(12),
    color: '#666666',
    fontWeight: '500'
  },
  scrollViewContentContainer: {
  //  height: FREE_HEIGHT
  },
  circleUnchecked: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderColor: '#9B9B9B',
    borderWidth: 1,
    height: dynamicSize(25),
    width: dynamicSize(25),
    borderRadius: dynamicSize(20)
  },
  circleChecked: {
    backgroundColor: '#9B9B9B'
  },
  logo: {
    width: Math.min(VIEWPORT.width, 120),
    height: Math.min(VIEWPORT.height, 31)
  }
})

LandingStep2.navigatorStyle = {
//  navBarHidden: true
}

LandingStep2.propTypes = {
  location: PropTypes.object.isRequired,
  range: PropTypes.number.isRequired,
  navigator: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
})

export default connect(mapStateToProps)(LandingStep2)
