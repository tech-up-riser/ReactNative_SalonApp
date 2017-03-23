import React, { Component, PropTypes } from 'react'
import {
  View,
  StyleSheet,
  Platform,
  Image,
  Text,
  TouchableOpacity
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Colors from '../constants/Colors'
import { connect } from 'react-redux'
import screens from '../constants/Screens'
import { logout } from '../actions/authAC'
import makeGetBlowoutsCount from '../selectors/BlowoutsCountSelector'
import { changeAppRoot } from '../actions/initAC'
import { NAV_ROOT_MAIN } from '../constants/NavState'
// import { getFontSize, dynamicSize } from '../utils/DynamicSize'
import { VIEWPORT } from '../constants'

function getFontSize (s) {
  return s
}

function dynamicSize (s) {
  return s
}

class Menu extends Component {

  _renderItem (text, handler, icon) {
    return (
      <TouchableOpacity style={styles.item} onPress={handler}>
        <Text style={styles.itemText}>{text}</Text>
        {icon}
      </TouchableOpacity>
    )
  }

  closeDrawer () {
    this.props.navigator.toggleDrawer({
      side: 'right', // the side of the drawer since you can have two, 'left' / 'right'
      animated: true, // does the toggle have transition animation or does it happen immediately (optional)
      to: 'closed' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
    })
  }

  request () {
    console.log('Request pressed')
    // this.props.navigator.pop()
    this.props.dispatch(changeAppRoot(NAV_ROOT_MAIN, true))
    //this.closeDrawer()
  }

  addBlowout () {
    console.log('Add a blowout pressed')
    this.closeDrawer()
    this.props.navigator.showModal({
//    this.props.navigator.showLightBox({
      screen: screens.SELECT_PACKAGE,
      navigatorStyle: {
        navBarHidden: true
      }
    })
    // this.props.navigator.push({
    //   screen: screens.CHECKOUT
    // })
    console.log('pushed', this.props.navigator)
  }

  goRequested () {
    console.log('Requested pressed')
    this.closeDrawer()
    this.props.navigator.showModal({
//    this.props.navigator.showLightBox({
      screen: screens.REQUESTED_APPOINTMENTS,
      navigatorStyle: {
        navBarHidden: true
      }
    })
  }

  goScheduled () {
    console.log('Scheduled pressed')
    this.closeDrawer()
    this.props.navigator.showModal({
//    this.props.navigator.showLightBox({
      screen: screens.SCHEDULED_APPOINTMENTS,
      navigatorStyle: {
        navBarHidden: true
      }
    })
  }

  goPast () {
    console.log('Past pressed')
    this.closeDrawer()
    this.props.navigator.showModal({
//    this.props.navigator.showLightBox({
      screen: screens.PAST_APPOINTMENTS,
      navigatorStyle: {
        navBarHidden: true
      }
    })
  }

  logOut () {
    this.props.dispatch(logout())
    // const { firebaseRef, setScreen }  = this.props
    // firebaseRef.unauth(() => {
    //   AsyncStorage.removeItem(AUTH_TOKEN_KEY, () => {
    //     setScreen(Screens.SIGN_IN)
    //   })
    // })
  }

  render () {
    const user = this.props.user
    const name = user.name
    const email = user.email
    return (
      <KeyboardAwareScrollView ref='scrollView' blockContentInset style={styles.scrollView}>

        <View style={styles.userInfoBox}>

            <Image source={require('../assets/images/avatar-placeholder.png')} style={styles.avatar} />
            <View style={styles.userInfoTextBox}>
              <Text style={styles.font14Gray}>{name}</Text>
              <Text style={styles.email}>{email}</Text>
            </View>

          <View style={styles.blowoutsCountContainer}>
            <View style={styles.blowoutsCountIcon}>
              <Image source={require('../assets/images/hairdryer.png')} style={styles.hairdryer} />
              <View style={styles.blowoutsCounter}>
                <Text style={styles.blowoutsCount}>{this.props.blowoutsCount}</Text>
              </View>
            </View>
            <Text style={[styles.email, {marginTop: 6}]}>balance</Text>

          </View>

        </View>

        <View style={styles.requestBox}>
          {this._renderItem('Promotions', this.goRequested.bind(this))}
        </View>
        <View style={styles.itemsBox}>
          {this._renderItem('Add a blowout', this.addBlowout.bind(this), <Image source={require('../assets/images/plus_in_circle.png')} style={styles.addBlowoutIcon} />)}
          {this._renderItem('Requested', this.goRequested.bind(this))}
          {this._renderItem('Scheduled', this.goScheduled.bind(this))}
          {this._renderItem('Past', this.goPast.bind(this))}
        </View>
        <TouchableOpacity style={styles.logoutBox} onPress={this.logOut.bind(this)}>
          <Image source={require('../assets/images/logout.png')} style={styles.logoutIcon} />
          <Text style={styles.font14Gray}>Logout</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    )
  }
}

const lineColor = 'rgba(29,29,38,0.1)'
const itemRightPadding = 17.5

const styles = StyleSheet.create({
  scrollView: {
    marginTop: Platform.OS === 'ios' ? VIEWPORT.height * 0.03 : 0,
    flex: 1,
    backgroundColor: 'white'
  },
  userInfoBox: {
    height: VIEWPORT.height * 0.1,
    borderBottomWidth: 1,
    borderColor: lineColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userInfoTextBox: {
    flex: 1,
    marginLeft: 10,
    marginRight: 5,
    justifyContent: 'center'
  },
  avatar: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
    marginLeft: 20
  },
  font14Gray: {
    fontSize: getFontSize(14),
    color: Colors.GRAY
  },
  email: {
    fontSize: getFontSize(9),
    color: Colors.GRAY
  },
  hairdryer: {
    marginRight: 5,
    width: dynamicSize(20),
    height: dynamicSize(20),
    resizeMode: 'contain'
  },
  blowoutsCounter: {
    // marginRight: dynamicSize(17.5),
    width: dynamicSize(20),
    height: dynamicSize(20),
    backgroundColor: '#EAA0B3',
    borderRadius: dynamicSize(10),
    alignItems: 'center',
    justifyContent: 'center'
  },
  blowoutsCountContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: dynamicSize(17.5)
  },
  blowoutsCount: {
    fontSize: getFontSize(10),
    color: '#FFFFFF'
  },
  blowoutsCountIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  requestBox: {
    height: VIEWPORT.height * 0.15,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: lineColor,
    paddingHorizontal: dynamicSize(29)
  },
  logo: {
    width: dynamicSize(90),
    resizeMode: 'contain'
  },
  itemsBox: {
    height: VIEWPORT.height * 0.344,
    borderBottomWidth: 1,
    borderColor: lineColor,
    paddingLeft: dynamicSize(29),
    paddingRight: itemRightPadding
  },
  item: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemText: {
    fontSize: getFontSize(14)
  },
  addBlowoutIcon: {
    width: dynamicSize(20),
    height: dynamicSize(20)
  },
  logoutBox: {
    height: VIEWPORT.height * 0.126,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: dynamicSize(32),
    paddingRight: itemRightPadding
  },
  logoutIcon: {
    width: dynamicSize(19),
    resizeMode: 'contain',
    marginRight: dynamicSize(18)
  }
})

Menu.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  blowoutsCount: PropTypes.number.isRequired,
  navigator: PropTypes.object.isRequired
}

const makeMapStateToProps = () => {
  const getBlowoutsCount = makeGetBlowoutsCount()
  const mapStateToProps = (state, props) => {
    return {
      user: state.user,
      blowoutsCount: getBlowoutsCount(state, props)
    }
  }
  return mapStateToProps
}

export default connect(makeMapStateToProps())(Menu)
