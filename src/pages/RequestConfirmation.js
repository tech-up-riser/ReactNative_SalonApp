import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native'
import {
  NAVIGATOR_HEIGHT,
  STATUS_BAR_HEIGHT,
  STATUS_BAR_COLOR,
  VIEWPORT
} from '../constants'
import BackButton from '../components/BackButton'
import AccountButton from '../components/AccountButton'
import Colors from '../constants/Colors'
import Button from '../components/Common/Button'
import screens from '../constants/Screens'
import moment from 'moment'
import { getFontSize } from '../utils/DynamicSize'

export default class RequestConfirmation extends Component {

  constructor (props) {
    super(props)
  }

  openDrawer () {
    this.props.navigator.toggleDrawer({
      side: 'right', // the side of the drawer since you can have two, 'left' / 'right'
      animated: true, // does the toggle have transition animation or does it happen immediately (optional)
      to: 'open' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
    })
  }

  onRequestDetials () {
    console.log('onRequestDetials')
    this.props.navigator.push({
      screen: screens.REQUESTED,
      navigatorStyle: {
        navBarHidden: true
      },
      passProps: {
        request: this.props.request,
        showCancelButton: false
      }
    })
  }

  // <BackButton onClick={() => this.props.navigator.popToRoot()} />
  renderNavBar () {
    return (
      <View style={styles.navBar}>
        <View style={{flex: 1}} />
        <Text style={styles.navTitle}>APPOINTMENT REQUEST</Text>
        <AccountButton onClick={this.openDrawer.bind(this)} />
      </View>
    )
  }

  render () {
    const { request } = this.props
    const date = moment(request.dateStart).format('ddd, MMMM D').toUpperCase()
    const t1 = moment(request.dateStart).format('hh:mm A')
    const t2 = moment(request.dateEnd).format('hh:mm A')
    const timeRange = t1 + ' - ' + t2
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        {this.renderNavBar()}
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>WE'RE ON IT!</Text>
        </View>
        <View style={styles.subHeadingContainer}>
          <Text style={styles.subHeadingText}>Your Concierge will get back to you with your booking details soon.</Text>
        </View>
        <View style={styles.dryerContainer}>
          <Image style={styles.dryerImage} resizeMode={'contain'} source={require('../assets/images/dryer.png')}/>
        </View>

        <View style={styles.requestInfoContainer}>
          <Text style={styles.near}>NEAR</Text>
          <Text style={styles.requestAddress}>{request.address}</Text>
          <Text style={styles.requestTime}>{date}</Text>
          <Text style={styles.requestTime}>{timeRange}</Text>
        </View>
        <View style={{ width: VIEWPORT.width}}>
          <Button
            type={'fullWidth'}
            label={'VIEW DETAILS'}
            backgroundColor={'#FBD6CA'}
            handleOnPress={this.onRequestDetials.bind(this)}
            fontSize={getFontSize(14)}
            />
        </View>
      </View>
    )
  }
}

RequestConfirmation.propTypes = {
  address: React.PropTypes.string,
  date: React.PropTypes.string,
  timeRange: React.PropTypes.string,
  request: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired
}

RequestConfirmation.defaultProps = {
  address: '101 S Roxbury Dr, Beverly Hills, CA 90210',
  date: 'FRI, APRIL 22',
  timeRange: '11:00AM - 3:00PM'
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: VIEWPORT.width,
    // backgroundColor: 'cyan'
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
    // flex: 4,
    textAlign: 'center'
  },
  dryerContainer: {
    // backgroundColor: 'pink'
  },
  dryerImage: {
    width: VIEWPORT.width * 0.3,
    height: VIEWPORT.height * 0.3,
    alignSelf: 'center',
    // backgroundColor: 'yellow'
  },
  requestInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    // backgroundColor: 'orange',
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    // flex: 1,
    width: VIEWPORT.width,
    height: VIEWPORT.height * 0.2,
    // paddingVertical: 20,
    // marginBottom: 30
  },
  requestTime: {
    color: '#8F92A3',
    fontWeight: '600',
    fontSize: getFontSize(14)
  },
  requestAddress: {
    color: '#5B5D68',
    fontWeight: '500',
    fontSize: getFontSize(14)
  },
  headingContainer: {
    // flex: 0.7,
    justifyContent: 'center',
    // flex: 1,
    // backgroundColor: 'lightgreen',
    marginTop: 20
  },
  headingText: {
    // fontSize: getFontSize(18),
    color: '#5B5D68',
    // textAlign: 'center',
    fontFamily: 'Futura',
    fontSize: getFontSize(16),
    // marginBottom: 12,
    fontWeight: '400',
    letterSpacing: 10,
    textAlign: 'center'
  },
  subHeadingContainer: {
    // flex: 1,
    justifyContent: 'center',
    marginHorizontal: 36,
    // backgroundColor: 'lightblue'

  },
  subHeadingText: {
    fontSize: getFontSize(14),
    color: '#5B5D68',
    flexWrap: 'wrap',
    textAlign: 'center',
    fontFamily: 'BodoniSvtyTwoITCTT-BookIta',
    fontStyle: 'italic',
    fontWeight: '100'
  },
  near: {
    color: '#5B5D68',
    fontWeight: '400'
  }
})
