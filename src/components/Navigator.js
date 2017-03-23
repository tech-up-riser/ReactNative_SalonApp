import React, { Component, PropTypes } from 'react'
import {
  NavigationExperimental,
  StyleSheet,
  Image,
  View,
  Platform,
  Text,
  TouchableOpacity,
  AsyncStorage
} from 'react-native'
import { connect } from 'react-redux'
import { pushScreen, popScreen, setScreen } from '../actions/navActions'
import * as usersActions from '../actions/usersAction'
import { bindActionCreators } from 'redux'
import Dimensions from 'Dimensions'
import Drawer from 'react-native-drawer'
import Menu from './Menu'
import SearchBar from './SearchBar'

import Walkthrough from './Walkthrough/Walkthrough'
import SingUp from './Auth/SignUp'
import SingIn from './Auth/SignIn'
import ForgotPassword from './Auth/ForgotPassword'
import ChangePassword from './Auth/ChangePassword'
import SalonsMap from './SalonsMap'
import LandingStep2 from './LandingStep2/LandingStep2'
import RequestConfirmation from './RequestConfirmation'

import { AUTH_TOKEN_KEY, USER_LOGGINED_KEY } from './constants'
import Screens from './constants/Screens'
import { logIn } from './Helpers'

const {
  AnimatedView: NavigationAnimatedView,
  Card: NavigationCard,
  RootContainer: NavigationRootContainer,
  CardStack: NavigationCardStack,
  Header: NavigationHeader
} = NavigationExperimental


class Navigator extends Component {

  constructor () {
    super()
    this.state = {
      isLoading: true,
      forgottenEmail: ''
    }
  }

  componentWillMount() {
    const { firebaseRef, setAuthData, setUserData, setScreen } = this.props
    AsyncStorage.getItem(USER_LOGGINED_KEY, (error, isUserLoggined) => {
      AsyncStorage.getItem(AUTH_TOKEN_KEY, (error, authKey) => {
        if (authKey) {
          firebaseRef.authWithCustomToken(authKey, (error, authData) => {
            if (error) {
              console.log(error)
              if (isUserLoggined) {
                setScreen(Screens.SIGN_IN)
              }
              this.setState({isLoading: false})
            } else {
              logIn(authData, firebaseRef, setAuthData, setUserData, () => {
                setScreen(Screens.SALONS_MAP)
                this.setState({
                  isLoading: false
                })
              })
            }
          })
        } else {
          if (isUserLoggined) {
            setScreen(Screens.SIGN_IN)
          }
          this.setState({isLoading: false})
        }
      })
    })
  }

  needMenu (screenName) {
    return !Object.values(Screens).slice(0, 5).includes(screenName)
  }

  _renderLaunchScreen () {
    const width = Dimensions.get('window').width
    const height = Dimensions.get('window').height
    let launchImageWidth
    let launchImageHeight
    let margin = 32
    launchImageWidth = Math.min(width - margin, 1170)
    launchImageHeight = Math.min(height - margin, 232)
    return (
      <View style={styles.launchScreen}>
        <Image source={require('../assets/images/launch-image.png')} style={{width: launchImageWidth, height: launchImageHeight, resizeMode: 'contain'}} />
      </View>
    )
  }

  _renderStatusBar () {
    if (Platform.OS === 'ios') {
      return (
        <View style={styles.statusBar} />
      )
    }
  }

  _renderLeftNavigationItem (screenName) {
    if (screenName === this.props.navigationState.routes[0].key) {
      return
    }
    return (
      <TouchableOpacity style={[styles.navigationItem, styles.leftNavigationItem]} onPress={this.props.popScreen}>
        <Image source={require('../assets/images/Back.png')} style={styles.backArrow} />
      </TouchableOpacity>
    )
  }

  _renderRigthNavigationItem (screenName) {
    if (!this.needMenu(screenName)) {
      return
    }
    return (
      <TouchableOpacity style={[styles.navigationItem, styles.rightNavigationItem]} onPress={this.openControlPanel}>
        <Image source={require('../assets/images/Account.png')} style={styles.account} />
      </TouchableOpacity>
    )
  }

  _renderTitle (screenName) {
    if (screenName === Screens.SIGN_IN) {
      return
    }
    if (screenName === Screens.SALONS_MAP) {
      return <SearchBar />
    }
    if (!this.needMenu(screenName)) {
      return <Image source={require('../assets/images/logo.png')} style={styles.logo}/>
    }
    return <Text>{screenName}</Text>
  }

  _renderAppBar(screenName) {
    return (
      <View style={styles.appBar}>
        {this._renderLeftNavigationItem(screenName)}
        {this._renderTitle(screenName)}
        {this._renderRigthNavigationItem(screenName)}
    </View>
    )
  }

  _renderHeader (screenName) {
    return (
      <View style={styles.navigationHeader}>
        {this._renderStatusBar()}
        {this._renderAppBar(screenName)}
      </View>
    )
  }

  _renderBody (screenName) {
    switch (screenName) {
      case Screens.WALKTHROUGH:
        return <Walkthrough />
      case Screens.SIGN_UP:
        return <SingUp />
      case Screens.SIGN_IN:
        return <SingIn />
      case Screens.FORGOT_PASSWORD:
        return <ForgotPassword />
      case Screens.CHANGE_PASSWORD:
        return <ChangePassword />
      case Screens.SALONS_MAP:
        return <SalonsMap />
      case Screens.LANDING_STEP_2:
        return <LandingStep2 />
      case Screens.REQUEST_CONFIRMATION:
        return <RequestConfirmation />
    }
  }

  _renderScene (props) {
//    let screenName = props.scene.navigationState.key
    const screenName = props.scene.route.key
    return (
      <View style={styles.container}>
        {this._renderHeader(screenName)}
        {this._renderBody(screenName)}
      </View>
    )
  }

  _renderCard (props) {
    console.log('_renderCard', props)
    const route = props.scene.route
    const screenName = route.key
    //const screenName = props.scene.navigationState.key
    return this._renderBody(screenName)

    // return (
    //   <NavigationCard
    //     {...props}
    //     key={props.scene.navigationState.key}
    //     renderScene={this._renderScene.bind(this)}
    //     panHandlers={null}
    //   />
    // )
  }

  _renderNavigator () {
    const { navigationState, onNavigate } = this.props
    console.log(navigationState)
    return (

      <NavigationCardStack
        onNavigate={onNavigate}
        style={styles.main}
        navigationState={this.props.navigationState}
        renderOverlay={props => {
          console.log('renderOverlay')
          // return this.renderHeader(props)
        }}
        renderScene={this._renderCard.bind(this)}
      />

      // <NavigationAnimatedView
      //   navigationState={navigationState}
      //   style={styles.container}
      //   onNavigate={onNavigate}
      //   renderScene={this._renderCard.bind(this)}
      // />
    )
  }

  _renderNavigatorWithMenu() {
    let menuOffcet = 270.0/750.0
    return (
      <Drawer
        ref='drawer'
        type="overlay"
        side='right'
        content={<Menu />}
        tapToClose
        openDrawerOffset={menuOffcet}
        panCloseMask={menuOffcet}
        tweenHandler={(ratio) => ({mainOverlay: { opacity: ratio, backgroundColor: 'rgba(0,0,0,0.65)', marginTop: Platform.OS === 'ios' ? 20 : 0 } })}
      >
        {this._renderNavigator()}
      </Drawer>
    )
  }

  closeControlPanel () {
    this.refs.drawer.close()
  }

  openControlPanel () {
    this.refs.drawer.open()
  }

  render () {
    const { isLoading } = this.state
    const navigationState = this.props.navigationState
    const screenName = navigationState.routes[navigationState.index].key
    console.log('render', isLoading, screenName, this.needMenu(screenName))
    if (isLoading) {
      return this._renderLaunchScreen()
    }
    if (!this.needMenu(screenName)) {
      return this._renderNavigator()
    }
    return this._renderNavigatorWithMenu()
  }
}

Navigator.propTypes = {
  navigatorState: PropTypes.object,
  onNavigate: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  launchScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  navigationHeader: {
    backgroundColor: 'white',
    borderBottomColor: 'rgba(0, 0, 0, .0)',
    height: Platform.OS === 'ios' ? 64 : 56
  },
  statusBar: {
    height: 20,
    backgroundColor: '#5B5D68'
  },
  appBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 99,
    height: 21,
    resizeMode: 'contain'
  },
  navigationItem: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftNavigationItem: {
    left: 0,
    width: 46
  },
  rightNavigationItem: {
    right: 0,
    width: 54
  },
  backArrow: {
    width: 15,
    height: 25,
    resizeMode: 'contain'
  },
  account: {
    width: 25,
    height: 25,
    resizeMode: 'contain'
  }
})

export default connect(
  state => ({
    navigationState: state.navReducer,
    firebaseRef: state.firebaseRef
  }),
  dispatch => ({
    ...bindActionCreators(usersActions, dispatch),
    onNavigate: (action) => {
      if (action.type && (
        action.type === NavigationRootContainer.getBackAction().type ||
        action.type === NavigationCard.CardStackPanResponder.Actions.BACK.type)
      ) {
        dispatch(popScreen())
      } else {
        dispatch(pushScreen(action))
      }
    },
    popScreen: (action) => {
      dispatch(popScreen())
    },
    setScreen: (screen) => {
      dispatch(setScreen(screen))
    }
  })
)(Navigator)
