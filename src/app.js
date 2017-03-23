import configureStore from './store'
import { Provider } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { appInitialized } from './actions/initAC'
import {
  NAV_ROOT_AUTH,
  NAV_ROOT_MAIN,
  NAV_ROOT_SIGN_UP,
  NAV_ROOT_SIGN_IN,
  NAV_ROOT_LOADING,
  NAV_ROOT_WALKTHROUGH
} from './constants/NavState'
import screens from './constants/Screens'
import FCM from 'react-native-fcm'
import { receiveFcmToken } from './actions/FCMTokenAC'
const store = configureStore()

// screen related book keeping
import { registerScreens } from './pages'
registerScreens(store, Provider)

// notice that this is just a simple class, it's not a React component
export default class App {
  constructor () {
    console.log('APP CONSTRUCTOR')
    // since react-redux only works on components, we need to subscribe this class manually
    store.subscribe(this.onStoreUpdate.bind(this))
    store.dispatch(appInitialized())
    this.updateId = 0

    FCM.requestPermissions()
    FCM.getFCMToken().then(token => {
      console.log('notification token', token)
      if (token) store.dispatch(receiveFcmToken(token))
    })
    // this.notificationUnsubscribe = FCM.on('notification', (notif) => {
    //   console.log('notificationUnsubscribe', notif)
    // })
    this.refreshUnsubscribe = FCM.on('refreshToken', (token) => {
      console.log('refreshToken', token)
      if (token) store.dispatch(receiveFcmToken(token))
    })

    FCM.getInitialNotification().then(notif => {
      console.log('-----notification data------', notif)
    })
  }

  onStoreUpdate () {
    console.log('On store update')
    const { root, updateId } = store.getState().app
    // handle a root change
    // if your app doesn't change roots in runtime, you can remove onStoreUpdate() altogether
    if (this.currentRoot !== root || this.updateId !== updateId) {
      this.currentRoot = root
      this.updateId = updateId
      this.startApp(root)
    }
  }

  startApp (root) {
    console.log('startApp, root', root)
    switch (root) {
      case NAV_ROOT_LOADING:
        Navigation.startSingleScreenApp({
          screen: {
            screen: screens.LOADING
          }
        })
        return

      case NAV_ROOT_WALKTHROUGH:
        Navigation.startSingleScreenApp({
          screen: {
            screen: screens.WALKTHROUGH,
            navigatorStyle: {
              navBarHidden: true
            }
          },
          animationType: 'fade'
        })
        return

      case NAV_ROOT_SIGN_UP:
        Navigation.startSingleScreenApp({
          screen: {
            screen: screens.SIGN_UP,
            navigatorStyle: {
              drawUnderNavBar: true,
              navBarNoBorder: true,
              navBarTranslucent: true,
              navBarTransparent: true
            }
          },
          animationType: 'slide-down'
        })
        return

      case NAV_ROOT_SIGN_IN:
        Navigation.startSingleScreenApp({
          screen: {
            screen: screens.SIGN_IN,
            navigatorStyle: {
              drawUnderNavBar: true,
              navBarNoBorder: true,
              navBarTranslucent: true,
              navBarTransparent: true
            }
          },
          animationType: 'slide-down'
        })
        return

      case NAV_ROOT_MAIN:
        Navigation.startSingleScreenApp({
          screen: {
            screen: screens.SALONS_MAP,
            navigatorStyle: {
              navBarHidden: true
            }
          },
          passProps: {},
        //  animationType: 'fade',
          animationType: 'slide-down',
          drawer: {
            right: {
              screen: screens.MENU,
              style: {
                rightDrawerWidth: '70'
              }
            },
            type: 'MMDrawer',
            animationType: 'parallax',    // door/parallax/slide/slide-and-scale
            disableOpenGesture: true,
            style: {
              rightDrawerWidth: '70'
            }
          }
        })
        return

      default:
        console.error('Unknown app root')
    }
  }
}
