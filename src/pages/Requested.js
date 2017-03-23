import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import screens from '../constants/Screens'
import BackButton from '../components/BackButton'
import ModalBox from '../components/Common/ModalBox'

import RangeMap from '../components/RangeMap'

import { cancelRequestFree } from '../actions/usersAction'
import {
  VIEWPORT,
  NAVIGATOR_HEIGHT,
  STATUS_BAR_HEIGHT,
  STATUS_BAR_COLOR
} from '../constants'
import { getFontSize, dynamicSize } from '../utils/DynamicSize'

class Requested extends Component {

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
        <Text style={styles.navTitle}>Request Details</Text>
        <View style={{flex: 1}}/>
      </View>
    )
  }

  componentWillMount () {
    const { request } = this.props
    const timeNowUnix = moment().unix()
    const dateEnd = moment(request.dateEnd)
    const isExpired = dateEnd.unix() < timeNowUnix
    this.setState({
      isExpired
    })
  }

  _hideModal () {
    this.setState({
      showModal: false
    })
  }

  _cancelRequest () {
    console.log('cancelRequest')
    const { navigator, dispatch, request } = this.props
    this._hideModal()
    dispatch(cancelRequestFree(request))
    navigator.pop()
  }

  showModal () {
    if (this.state.showModal) {
      return (
        <ModalBox
          showModal={this.state.showModal}
          cancellationFee={0}
          onCancel={this._hideModal.bind(this)}
          onApply={this._cancelRequest.bind(this)}
        />
      )
    }
  }

  render () {
    const { request } = this.props
    console.log('render request', request)
    const coordinates = {
      latitude: request.lat,
      longitude: request.lng,
      latitudeDelta: 0.002422,
      longitudeDelta: 0.0221
    }
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        {this.renderNavBar()}
        <ScrollView>
          <View style={styles.contentContainer}>
            {this._renderRequestStatus(request)}
            <View style={{height: VIEWPORT.height / 4}}>
              <RangeMap
                coordinates={coordinates}
                width={VIEWPORT.width}
              />
            </View>
            <Text style={styles.locationText}>{request.address}</Text>
            {this._renderAppointmentTime(request)}

            {this._renderCancelButton('CANCEL REQUEST')}
            {this._renderCancelationPolicy()}

            {this.showModal.bind(this)()}
          </View>
        </ScrollView>
      </View>
    )
  }

  _renderRequestStatus (request) {
    const headingText = (this.state.isExpired) ? 'Your appointment could not be booked' : 'Your appointment has been requested'
    return (
      <View style={styles.requestStatusContainer}>
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>{headingText}</Text>
        </View>
        <View style={styles.rageContainer}>
          <Text style={styles.normalText}>Within {request.range} miles of</Text>
        </View>
      </View>
    )
  }

  _renderAppointmentTime (request) {
    return (
      <View style={styles.requestInfoContainer}>
        <Text style={[styles.requestTime, styles.dateText]}>{moment(request.dateStart).format('ddd, MMMM D').toUpperCase()}</Text>
        <Text style={styles.requestTime}>
          {moment(request.dateStart).format('hh:mm A')} - {moment(request.dateEnd).format('hh:mm A')}
        </Text>
      </View>
    )
  }

  _renderCancelButton (buttonText) {
    if (!this.state.isExpired && this.props.showCancelButton) {
      return (
        <View>
          <TouchableHighlight onPress={() => this.setState({showModal: !this.state.showModal})}
            style={styles.cancelButton}>
            <Text style={styles.normalText}>{buttonText}</Text>
          </TouchableHighlight>
        </View>
      )
    }
  }

  _showCancellationPolicy () {
    console.log('showCancellationPolicy')
    this.props.navigator.push({
      screen: screens.CANCELLATION_POLICY,
      navigatorStyle: {
        navBarHidden: true
      }
    })
  }

  _renderCancelationPolicy () {
    if (!this.state.isExpired && this.props.showCancelButton) {
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
  requestStatusContainer: {
    height: VIEWPORT.height * 0.22,
    flexDirection: 'column'
  },
  headingContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 4
  },
  rageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2
  },
  headingText: {
    color: '#5B5D68',
    fontSize: getFontSize(18),
    marginBottom: dynamicSize(30)
  },
  normalText: {
    color: '#5B5D68',
    fontSize: getFontSize(14)
  },
  locationText: {
    color: '#5B5D68',
    fontSize: getFontSize(14),
    fontWeight: '500',
    marginTop: dynamicSize(35)
  },
  requestInfoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: dynamicSize(15)
  },
  requestTime: {
    color: '#8F92A3',
    fontWeight: '600',
    fontSize: getFontSize(14)
  },
  dateText: {
    marginBottom: dynamicSize(5)
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
    height: dynamicSize(40),
    paddingHorizontal: VIEWPORT.width / 5.5,
    borderRadius: dynamicSize(4),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#5B5D68',
    borderWidth: 1,
    marginTop: dynamicSize(20)
  }
})

// ---
// Props
// ---

Requested.defaultProps = {
  showCancelButton: true
}

Requested.propTypes = {
  request: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  showCancelButton: PropTypes.bool
}

const mapStateToProps = state => ({
})

export default connect(mapStateToProps)(Requested)
