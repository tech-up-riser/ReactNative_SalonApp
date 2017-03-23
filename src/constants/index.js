import {
  Dimensions,
  Navigator
} from 'react-native'

export const NAVIGATOR_HEIGHT = Navigator.NavigationBar.Styles.General.NavBarHeight
export const VIEWPORT = Dimensions.get('window')
export const SUBMIT_BUTTON_HEIGHT = VIEWPORT.height * 0.082
// export const SUBMIT_BUTTON_HEIGHT = 55
export const STATUS_BAR_HEIGHT = 20
// export const STATUS_BAR_COLOR = '#5B5D68'
export const STATUS_BAR_COLOR = '#FFFFFF'

export const FREE_HEIGHT = VIEWPORT.height - NAVIGATOR_HEIGHT - SUBMIT_BUTTON_HEIGHT - STATUS_BAR_HEIGHT

console.log('RESOLUTION:', VIEWPORT.width, VIEWPORT.height, 'NAVIGATOR_HEIGHT', NAVIGATOR_HEIGHT)

export const FIREBASE_URL = 'https://vurve.firebaseio.com'
export const FIREBASE_SECRET = 'rDIFgSXYdywH6l2jzGNSTmicKZ95T0CxgOUMRhN4'

export const PASSWORD_LENGTH_MIN = 6

export const CANT_BE_EMPTY_TEXT = 'Please enter a valid'
export const EMAIL_INVALID_TEXT = 'Please enter a valid email address'
export const PASSWORD_MIN_LENGTH_TEXT = 'Minimum characters for password: ' + PASSWORD_LENGTH_MIN

export const EMAIL_REG = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})$/

export const AUTH_TOKEN_KEY = 'AUTH_TOKEN'
export const USER_LOGGINED_KEY = 'USER_LOGGINED'
