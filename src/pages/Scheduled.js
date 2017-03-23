import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native'

import moment from 'moment'
import MapView from 'react-native-maps'
import Button from '../components/Common/Button'
import ModalBox from '../components/Common/ModalBox'
import BackButton from '../components/BackButton'
import screens from '../constants/Screens'
import { connect } from 'react-redux'
import { cancelAppointmentFree } from '../actions/usersAction'
import { VIEWPORT, NAVIGATOR_HEIGHT, STATUS_BAR_HEIGHT, STATUS_BAR_COLOR } from '../constants'
import { addCalendarEvent } from '../components/Calendar/Calendar'
import { getFontSize, dynamicSize } from '../utils/DynamicSize'

class Scheduled extends Component {

  constructor (props) {
    super(props)
    this.state = {
      showModal: false
    }
  }

  renderNavBar () {
    return (
      <View style={styles.navBar}>
        <BackButton onClick={() => this.props.navigator.pop({})}/>
        <Text style={styles.navTitle}>Appointment Details</Text>
        <View style={{flex: 1}}/>
      </View>
    )
  }

  addToCalendar () {
    const {request, booking} = this.props
    const event = {
      id: booking.id,
      title: 'Vurve appointment at ' + request.salonName,
      location: request.address,
      date: (new Date(booking.booking)).toISOString()
    }
    addCalendarEvent(event)
  }

  render () {
    const { request } = this.props
//    console.log('render request', request)
    const coordinates = {
      latitude: parseFloat(request.lat),
      longitude: parseFloat(request.lng),
      latitudeDelta: 0.002422,
      longitudeDelta: 0.0221
    }
    return (
      <View style={styles.container} >
        <View style={styles.statusBar}/>
        {this.renderNavBar()}

        <View style={styles.contentContainer}>
          {this._renderAppointmentStatus(request)}

          <MapView
            style={styles.map}
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
          </MapView>

          {this._renderAppointmentTime(request)}
          {this._renderCancelButton('CANCEL APPOINTMENT')}
          {this._renderCancellationPolicy()}
          {this._renderModal()}
        </View>
        <Button
          type='fullWidth'
          color='white'
          backgroundColor='#EAA0B3'
          fontSize={getFontSize(14)}
          fontWeight='500'
          handleOnPress={this.addToCalendar.bind(this)}
          label='ADD TO CALENDAR' />

      </View>
    )
  }

  _hideModal () {
    this.setState({
      showModal: false
    })
  }

  _isPenalty () {
    const timeNow = moment()
    const timeNowUnix = timeNow.unix()
    console.log(timeNow.format())
    const timeScheduled = moment(this.props.booking.booking)
    console.log(timeScheduled.format())
    const timeScheduledUnix = timeScheduled.unix()
    const deltaSeconds = timeScheduledUnix - timeNowUnix
    console.log('timeNowUnix', timeNowUnix, 'timeScheduledUnix', timeScheduledUnix, 'deltaSeconds', deltaSeconds)
    const isPenalty = deltaSeconds < this.props.settings.freeHoursBeforeBooking * 60 * 60
    console.log('isPenalty', isPenalty)
    return isPenalty
  }

  _cancelAppointment () {
    const { dispatch, request, booking, navigator } = this.props
    console.log('cancelAppointment request', request, 'booking', booking)
    this._hideModal()
    const isPenalty = this._isPenalty()
    if (isPenalty) {
      navigator.push({
        screen: screens.BUY_CANCELLATION,
        navigatorStyle: {
          navBarHidden: true
        },
        passProps: {
          packId: booking.packId,
          requestId: booking.id
        }
      })
    } else {
      dispatch(cancelAppointmentFree(request, booking))
      navigator.pop()
    }
  }

  _cancellationFee () {
    const isPenalty = this._isPenalty()
    if (isPenalty) {
      return this.props.settings.cancellationFee
    } else {
      return 0
    }
  }

  _renderModal () {
    if (this.state.showModal) {
      return (
        <ModalBox
          showModal={this.state.showModal}
          cancellationFee={this._cancellationFee()}
          onCancel={this._hideModal.bind(this)}
          onApply={this._cancelAppointment.bind(this)}
        />
      )
    }
  }

  _renderAppointmentTime (request) {
    return (
      <View style={styles.requestInfoContainer}>
        <Text style={styles.locationText}>{request.address}</Text>
        <Text style={styles.appointmentTime}>{moment(this.props.booking.booking).format('ddd, MMMM D').toUpperCase()}</Text>
        <Text style={styles.appointmentTime}>{moment(this.props.booking.booking).format('hh:mm A')}</Text>
      </View>
    )
  }

  _renderCancelButton (buttonText) {
    return (
      <TouchableHighlight onPress={() => this.setState({showModal: !this.state.showModal})} style={styles.cancelButton}>
        <Text style={styles.locationText}>{buttonText}</Text>
      </TouchableHighlight>
    )
  }

  _renderAppointmentStatus (request) {
//    console.log('_renderAppointmentStatus', request)
    return (
      <View style={styles.headingContainer}>
        <View style={styles.requestTopContainer}>
          <View style={styles.pinkPartialLine} />
          <Text style={styles.headingText}>Appointment is scheduled</Text>
          <View style={styles.pinkPartialLine} />
        </View>
        <View>
          <Text style={styles.atSymbolText}>@</Text>
          <Text style={styles.bookedSalonText}>{request.salonName.toUpperCase()}</Text>
        </View>
      </View>
    )
  }

  _showCancellationPolicy () {
//    console.log('showCancellationPolicy')
    this.props.navigator.push({
      screen: screens.CANCELLATION_POLICY,
      navigatorStyle: {
        navBarHidden: true
      }
    })
  }

  _renderCancellationPolicy () {
    return (
      <TouchableOpacity
        onPress={this._showCancellationPolicy.bind(this)}
        style={styles.cancelPolicy}
      >
        <Text style={styles.cancelPolicyText}>CANCELLATION POLICY</Text>
      </TouchableOpacity>
    )
  }

}

const styles = StyleSheet.create({
  container: {
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
    flex: 4,
    fontSize: getFontSize(14),
    color: '#4A4A4A',
    fontWeight: '300',
    textAlign: 'center'
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  headingContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: dynamicSize(40),
    height: VIEWPORT.height / 7
  },
  map: {
    height: VIEWPORT.height / 4,
    width: VIEWPORT.width
  },
  headingText: {
    color: '#5B5D68',
    fontSize: getFontSize(18),
    marginHorizontal: dynamicSize(30)
  },
  locationText: {
    color: '#5B5D68',
    fontSize: getFontSize(14)
  },
  bookedSalonText: {
    color: '#EAA0B3',
    fontSize: getFontSize(14),
    fontWeight: '500',
    marginBottom: dynamicSize(15)
  },
  requestInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: dynamicSize(20),
//    marginBottom: dynamicSize(10),
    height: dynamicSize(110)
  },
  requestTime: {
    color: '#8F92A3',
    fontWeight: '600',
    fontSize: getFontSize(14)
  },
  appointmentTime: {
    color: '#EAA0B3',
    fontWeight: '600',
    fontSize: getFontSize(14)
  },
  requestAddress: {
    color: '#5B5D68',
    fontWeight: '500',
    fontSize: getFontSize(14)
  },
  cancelPolicy: {
    alignSelf: 'flex-end',
    marginTop: dynamicSize(14),
    marginRight: dynamicSize(25)
  },
  cancelPolicyText: {
    color: '#666666',
    fontWeight: '500',
    fontSize: getFontSize(12)
  },
  cancelButton: {
    paddingVertical: dynamicSize(13),
    paddingHorizontal: VIEWPORT.width / 5.5,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#5B5D68',
    borderWidth: 1
  },
  pinkPartialLine: {
    backgroundColor: '#EAA0B3',
    height: 2,
    flex: 1
  },
  requestTopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  atSymbolText: {
    fontSize: getFontSize(16),
    fontWeight: '100',
    alignSelf: 'center',
//    marginBottom: dynamicSize(10)
  }
})

// ---
// Props
// ---
Scheduled.propTypes = {
  request: PropTypes.object.isRequired,
  booking: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  settings: state.settings
})

export default connect(mapStateToProps)(Scheduled)
